import type { Column, FilterConfig, FilterModel, TextOperator, NumberOperator, DateOperator } from '../types';
import { get } from './get';

export function textMatch(target: any, query: string, operator: TextOperator = 'contains', caseSensitive = false) {
  const norm = (s: any) => (s == null ? '' : String(s));
  let t = norm(target);
  let q = norm(query);
  if (!caseSensitive) { t = t.toLowerCase(); q = q.toLowerCase(); }
  switch (operator) {
    case 'contains': return t.includes(q);
    case 'startsWith': return t.startsWith(q);
    case 'endsWith': return t.endsWith(q);
    case 'equals': return t === q;
  }
}

export function numberMatch(target: any, value: number, op: NumberOperator = 'eq') {
  const n = Number(target);
  switch (op) {
    case 'eq': return n === value;
    case 'neq': return n !== value;
    case 'gt': return n > value;
    case 'gte': return n >= value;
    case 'lt': return n < value;
    case 'lte': return n <= value;
    case 'between': return false;
  }
}

export function numberRangeMatch(target: any, from?: number, to?: number) {
  const n = Number(target);
  if (from != null && n < from) return false;
  if (to != null && n > to) return false;
  return true;
}

export function dateMatch(target: any, value: Date, op: DateOperator = 'on') {
  const d = new Date(target);
  const v = new Date(value);
  switch (op) {
    case 'on': return d.toDateString() === v.toDateString();
    case 'before': return d < v;
    case 'after': return d > v;
    case 'between': return false;
  }
}

export function dateRangeMatch(target: any, from?: Date, to?: Date) {
  const d = new Date(target);
  if (from && d < from) return false;
  if (to && d > to) return false;
  return true;
}

export function buildPredicate<Row = any>(columns: Column<Row>[], filters: FilterModel) {
  const map = new Map(columns.map(c => [c.id, c]));
  return (row: Row) => {
    for (const [id, fv] of Object.entries(filters || {})) {
      if (fv === undefined || fv === null || (typeof fv === 'string' && fv.trim() === '')) continue;
      const col = map.get(id as any);
      if (!col || !col.filter) continue;
      const val = col.accessor ? col.accessor(row) : get(row as any, col.field);
      const cfg = col.filter as FilterConfig;
      let ok = true;
      switch (cfg.kind) {
        case 'text': ok = textMatch(val, String(fv), cfg.operator, (cfg as any).caseSensitive); break;
        case 'number': ok = numberMatch(val, Number(fv), cfg.operator); break;
        case 'numberRange': { const o = fv as any; ok = numberRangeMatch(val, o?.from, o?.to); break; }
        case 'date': { const d = fv instanceof Date ? fv : new Date(String(fv)); ok = dateMatch(val, d, cfg.operator); break; }
        case 'dateRange': { const o = fv as any; const f = o?.from ? new Date(o.from) : undefined; const t = o?.to ? new Date(o.to) : undefined; ok = dateRangeMatch(val, f, t); break; }
        case 'boolean': ok = Boolean(val) === Boolean(fv); break;
        case 'enum': ok = Array.isArray(fv) ? (fv as any[]).includes(val) : val === fv; break;
        case 'custom': ok = (cfg as any).predicate ? (cfg as any).predicate(fv, row) : true; break;
        default: ok = true;
      }
      if (!ok) return false;
    }
    return true;
  };
}
