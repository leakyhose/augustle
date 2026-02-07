export type GameMode = 'classic' | 'byzantine' | 'all' | 'bust';

export interface Emperor {
    name: string;
    dynasty: string;
    dynastyIndex: number;
    reignStartYear: number;
    reignLengthDays: number;
    succession: string;
    fate: string;
    birthplace: string;
    religion: string;
    portrait: string;
    hint: string;
    description: string;
    hide: boolean;
}

export type Feedback = {
    name: false | "close-name" | { name: string; portrait: string };
    dynasty: "earlier" | "later" | { correct: string };
    reignStart: "earlier" | "later" | "earlier-close" | "later-close" | { correct: number };
    length: "shorter" | "longer" | "shorter-close" | "longer-close" | { correct: number };
    succession: "incorrect" | { correct: string };
    fate: "incorrect" | { correct: string };
    birthplace: "incorrect" | "close" | { correct: string };
    religion: "incorrect" | "close" | { correct: string };
}

