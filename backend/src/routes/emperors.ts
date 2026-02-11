import express from 'express'
import type { Emperor } from '../../../shared/types.js'
import { getEmperors, loadEmperors } from '../data/loadEmperors.js'

const router = express.Router()
await loadEmperors();

const allEmperors = getEmperors();

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

function getDailyEmperor(pool: Emperor[], dateStr: string): Emperor {
    const dayNumber = dateToDayNumber(dateStr);
    const index = ((dayNumber * 3) % pool.length + pool.length) % pool.length;
    return pool[index];
}

router.get('/', (req, res) => {
    const todayStr = getESTDateString();
    const roundId = `${todayStr}-classic`;
    res.json({ emperors: allEmperors, roundId });
})

export default router