// filterUtils.ts - Helper functions for filtering logic
import type { Column, FilterModel } from '../types';

/** Simple debounce helper */
export function debounce<T extends (...args: any[]) => void>(fn: T, wait = 300) {
  let t: number | undefined;
  return ((...args: any[]) => {
    clearTimeout(t);
    t = window.setTimeout(() => fn(...args), wait);
  }) as T;
}

export function applyFilters(data: any[], filters: FilterModel, columns: Column[]) {
  if (!filters || Object.keys(filters).length === 0) return data;
  return data.filter(row => {
    return Object.entries(filters).every(([field, value]) => {
      if (value == null || value === '' || (typeof value === 'object' && Object.keys(value).length === 0))
        return true;
      const col = columns.find(c => c.field === field);
      const cell = row[field as keyof typeof row];
      switch (col?.filterType) {
        case 'number':
          const { min, max } = value as { min?: number; max?: number };
          if (min != null && cell < min) return false;
          if (max != null && cell > max) return false;
          return true;
        case 'date':
          const { from, to } = value as { from?: string; to?: string };
          const dateVal = new Date(cell).getTime();
          if (from && dateVal < new Date(from).getTime()) return false;
          if (to && dateVal > new Date(to).getTime()) return false;
          return true;
        case 'boolean':
          if (value === 'all') return true;
          return Boolean(cell) === Boolean(value);
        default:
          return String(cell ?? '')
            .toLowerCase()
            .includes(String(value).toLowerCase());
      }
    });
  });
}
