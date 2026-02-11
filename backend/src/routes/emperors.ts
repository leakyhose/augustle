import express, { Request, Response } from 'express'
import type { Feedback, Emperor, GameMode } from '../../../shared/types.js'
import { getEmperors, loadEmperors, filterEmperorsByMode } from '../data/loadEmperors.js'

const router = express.Router()
await loadEmperors();

const allEmperors = getEmperors();

const classicPool   = filterEmperorsByMode(allEmperors, 'classic');
const byzantinePool = filterEmperorsByMode(allEmperors, 'byzantine');
const bustPool      = filterEmperorsByMode(allEmperors, 'bust');

// Excludes hidden emperors
const classicTargetPool   = classicPool.filter(e => !e.hide);
const byzantineTargetPool = byzantinePool.filter(e => !e.hide);
const bustTargetPool      = bustPool.filter(e => !e.hide);
const allTargetPool       = allEmperors.filter(e => !e.hide);

const targetPools: Record<GameMode, Emperor[]> = {
    classic:   classicTargetPool,
    byzantine: byzantineTargetPool,
    all:       allTargetPool,
    bust:      bustTargetPool,
};

const SEEDS: Record<GameMode, number> = {
    classic:   3,
    byzantine: 7,
    all:       11,
    bust:      13,
};

function getESTDateString(): string {
    const fmt = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/New_York',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
    return fmt.format(new Date());
}

function dateToDayNumber(dateStr: string): number {
    return Math.floor(new Date(dateStr + 'T00:00:00Z').getTime() / 86_400_000);
}

function getDailyEmperor(pool: Emperor[], mode: GameMode, dateStr: string): Emperor {
    const dayNumber = dateToDayNumber(dateStr);
    const seed = SEEDS[mode];
    const index = ((dayNumber * seed) % pool.length + pool.length) % pool.length;
    return pool[index];
}

function getDailyState(mode: GameMode) {
    const todayStr = getESTDateString();
    const pool = targetPools[mode];
    const emperor = getDailyEmperor(pool, mode, todayStr);
    const roundId = `${todayStr}-${mode}`;

    const yesterdayDay = dateToDayNumber(todayStr) - 1;
    const yesterdayStr = new Date(yesterdayDay * 86_400_000).toISOString().slice(0, 10);
    const yesterdayEmperor = getDailyEmperor(pool, mode, yesterdayStr);

    return { emperor, roundId, yesterdayName: yesterdayEmperor.name };
}

function getMode(req: Request): GameMode {
    const m = req.query.mode;
    if (m === 'byzantine' || m === 'all' || m === 'bust') return m;
    return 'classic';
}

router.get('/', (req, res) => {
    const mode = getMode(req);
    const { emperor, roundId, yesterdayName } = getDailyState(mode);

    const searchPool = mode === 'bust' ? classicPool : filterEmperorsByMode(allEmperors, mode);

    const response: Record<string, unknown> = {
        emperors: searchPool,
        roundId,
        yesterday: yesterdayName,
    };

    if (mode === 'bust') {
        response.portrait = emperor.portrait;
    }

    res.json(response);
})

router.get('/hint', (req, res) => {
    const mode = getMode(req);
    const { emperor } = getDailyState(mode);
    res.json({ hint: emperor.hint });
})

function getBaseName(name: string): string {
    return name.split(/\s+/)[0];
}

router.post('/guess', (req: Request<{}, {}, Emperor>, res: Response<Feedback | Emperor>) => {
    const guess = req.body;
    const mode = getMode(req);
    const target = getDailyState(mode).emperor;

    if (guess.name === target.name) {
        return res.json(target);
    }

    if (mode === 'bust') {
        const feedback: Feedback = {
            name: false,
            dynasty: "incorrect" as any,
            reignStart: "incorrect" as any,
            length: "incorrect" as any,
            succession: "incorrect",
            fate: "incorrect",
            birthplace: "incorrect",
            religion: "incorrect",
        };
        return res.json(feedback);
    }

    const reignStartDiff = Math.abs(guess.reignStartYear - target.reignStartYear);
    const lengthDiff = Math.abs(guess.reignLengthDays - target.reignLengthDays);

    const ROME_ITALIA = new Set(['Rome', 'Italia']);
    const birthplaceClose = ROME_ITALIA.has(guess.birthplace) && ROME_ITALIA.has(target.birthplace);

    const CHRISTIAN = new Set(['Orthodox', 'Iconoclast', 'Arian', 'Miaphysite', 'Catholic']);
    const religionClose = CHRISTIAN.has(guess.religion) && CHRISTIAN.has(target.religion);
    const feedback: Feedback = {
        name: getBaseName(guess.name) === getBaseName(target.name) ? "close-name" : false,
        dynasty: guess.dynastyIndex < target.dynastyIndex ? "later"
               : guess.dynastyIndex > target.dynastyIndex ? "earlier"
               : { correct: target.dynasty },
        reignStart: guess.reignStartYear < target.reignStartYear
                  ? (reignStartDiff <= 100 ? "later-close" : "later")
                  : guess.reignStartYear > target.reignStartYear
                  ? (reignStartDiff <= 100 ? "earlier-close" : "earlier")
                  : { correct: target.reignStartYear },
        length: guess.reignLengthDays < target.reignLengthDays
              ? (lengthDiff <= 5 * 365 ? "longer-close" : "longer")
              : guess.reignLengthDays > target.reignLengthDays
              ? (lengthDiff <= 5 * 365 ? "shorter-close" : "shorter")
              : { correct: target.reignLengthDays },
        succession: guess.succession === target.succession
                  ? { correct: target.succession }
                  : "incorrect",
        fate: guess.fate === target.fate
            ? { correct: target.fate }
            : "incorrect",
        birthplace: guess.birthplace === target.birthplace
                  ? { correct: target.birthplace }
                  : birthplaceClose ? "close" : "incorrect",
        religion: guess.religion === target.religion
                ? { correct: target.religion }
                : religionClose ? "close" : "incorrect",
    };

    res.json(feedback);
})

export default router
