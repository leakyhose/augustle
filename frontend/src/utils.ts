import type { Emperor, Feedback } from '@shared/types.ts';

export type CardState = {
  color: 'correct' | 'wrong' | 'close';
  text: string;
  arrow?: '↑' | '↓';
};

export function isEmperorResponse(resp: Emperor | Feedback): resp is Emperor {
  return typeof (resp as Emperor).portrait === 'string';
}

export function formatReignLength(days: number): string {
  const years  = Math.floor(days / 365);
  const months = Math.floor((days % 365) / 30);
  const rem    = days % 365 % 30;

  if (days < 30) return `${days}d`;

  const parts: string[] = [];
  if (years  > 0) parts.push(`${years}y`);
  if (months > 0) parts.push(`${months}m`);
  if (rem    > 0) parts.push(`${rem}d`);
  return parts.join(' ');
}

export function formatYear(year: number): string {
  return year < 0 ? `${Math.abs(year)} BC` : `AD ${year}`;
}

type FeedbackField = keyof Omit<Feedback, 'name'>;

export function getCardState(
  field: FeedbackField,
  feedbackValue: Feedback[FeedbackField],
  emperor: Emperor,
): CardState {
  if (typeof feedbackValue === 'object' && feedbackValue !== null && 'correct' in feedbackValue) {
    const val = (feedbackValue as { correct: string | number }).correct;
    let text: string;
    if (field === 'reignStart') {
      text = formatYear(val as number);
    } else if (field === 'length') {
      text = formatReignLength(val as number);
    } else {
      text = String(val);
    }
    return { color: 'correct', text };
  }

  let displayText: string;
  if (field === 'reignStart') {
    displayText = formatYear(emperor.reignStartYear);
  } else if (field === 'length') {
    displayText = formatReignLength(emperor.reignLengthDays);
  } else if (field === 'dynasty') {
    displayText = emperor.dynasty;
  } else if (field === 'succession') {
    displayText = emperor.succession;
  } else if (field === 'fate') {
    displayText = emperor.fate;
  } else if (field === 'birthplace') {
    displayText = emperor.birthplace;
  } else {
    displayText = emperor.religion;
  }

  const str = feedbackValue as string;
  if (str === 'later')          return { color: 'wrong',  text: displayText, arrow: '↑' };
  if (str === 'earlier')        return { color: 'wrong',  text: displayText, arrow: '↓' };
  if (str === 'later-close')    return { color: 'close',  text: displayText, arrow: '↑' };
  if (str === 'earlier-close')  return { color: 'close',  text: displayText, arrow: '↓' };
  if (str === 'longer')         return { color: 'wrong',  text: displayText, arrow: '↑' };
  if (str === 'shorter')        return { color: 'wrong',  text: displayText, arrow: '↓' };
  if (str === 'longer-close')   return { color: 'close',  text: displayText, arrow: '↑' };
  if (str === 'shorter-close')  return { color: 'close',  text: displayText, arrow: '↓' };
  if (str === 'close')          return { color: 'close',  text: displayText };
  return { color: 'wrong', text: displayText };
}

export function buildSyntheticFeedback(emperor: Emperor): Feedback {
  return {
    name: { name: emperor.name, portrait: emperor.portrait },
    dynasty:    { correct: emperor.dynasty },
    reignStart: { correct: emperor.reignStartYear },
    length:     { correct: emperor.reignLengthDays },
    succession:  { correct: emperor.succession },
    fate:        { correct: emperor.fate },
    birthplace:  { correct: emperor.birthplace },
    religion:    { correct: emperor.religion },
  };
}
