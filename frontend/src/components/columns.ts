import type { Feedback } from '@shared/types.ts';

export const COLUMNS: Array<{
  label: string;
  field: keyof Omit<Feedback, 'name'>;
  flex: number;
}> = [
  { label: 'Dynasty/Era',  field: 'dynasty',     flex: 1.6 },
  { label: 'Birthplace',   field: 'birthplace',   flex: 1.3 },
  { label: 'Religion',     field: 'religion',     flex: 1.2 },
  { label: 'Start',         field: 'reignStart',   flex: 1 },
  { label: 'Length',        field: 'length',       flex: 1 },
  { label: 'Succession',   field: 'succession',   flex: 1.2 },
  { label: 'Fate',         field: 'fate',         flex: 1.2 },
];
