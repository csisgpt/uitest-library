import type { Column } from '../types';
export function toCSV(columns: Column[], rows: any[]): string {
  const headers = columns.map(c => c.header || c.id);
  const lines = [headers.join(',')];
  for (const r of rows) {
    const vals = columns.map(c => {
      let v: any;
      if (c.accessor) v = c.accessor(r);
      else if (c.field) v = c.field.split('.').reduce((acc: any, k: string) => (acc == null ? undefined : acc[k]), r);
      if (c.format) v = c.format(v, r);
      if (v == null) v = '';
      const s = String(v).replace(/\"/g, '\"\"');
      return /[\",\\n]/.test(s) ? `\"${s}\"` : s;
    });
    lines.push(vals.join(','));
  }
  return lines.join('\\n');
}
