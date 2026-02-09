import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csv from 'csv-parser';
import stripBom from 'strip-bom-stream';
import type { Emperor } from '../../../shared/types.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const emperors: Emperor[] = [];

export function loadEmperors(): Promise<Emperor[]> {
    return new Promise((resolve, reject) => {
        if (emperors.length > 0) {
            resolve(emperors);
            return;
        }

        const csvPath = path.join(__dirname, '../../../shared/emperors.csv');
        const dynastyMap = new Map<string, number>();
        let dynastyIndex = 0;
        
        fs.createReadStream(csvPath)
            .pipe(stripBom())
            .pipe(csv())
            .on('data', (row) => {
                if (!dynastyMap.has(row.dynasty)) {
                    dynastyMap.set(row.dynasty, dynastyIndex++);
                }
                
                emperors.push({
                    name: row.name,
                    dynasty: row.dynasty,
                    dynastyIndex: dynastyMap.get(row.dynasty)!,
                    reignStartYear: parseInt(row.reign_start_year, 10),
                    reignLengthDays: parseInt(row.reign_length_days, 10),
                    succession: row.succession,
                    fate: row.fate,
                    birthplace: row.birthplace ?? '',
                    religion: row.religion ?? '',
                    portrait: row.portrait_url,
                    hint: row.hint ?? '',
                    description: row.description ?? '',
                    hide: row.hide === 'true',
                });
            })
            .on('end', () => {
                console.log(`Loaded ${emperors.length} emperors`);
                resolve(emperors);
            })
            .on('error', reject);
    });
}

export function getEmperors(): Emperor[] {
    return emperors;
}