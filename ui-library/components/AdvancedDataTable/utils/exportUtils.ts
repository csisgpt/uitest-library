// exportUtils.ts - Utility functions to export table data to CSV and Excel
import type { Column } from '../types';

function createLink(blob: Blob, filename: string) {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

export function exportCSV(columns: Column[], data: any[], filename = 'export.csv') {
  const headers = columns.map(c => c.header).join(',');
  const rows = data
    .map(row =>
      columns
        .map(c => {
          const val = row[c.field];
          return val == null ? '' : `"${String(val).replace(/"/g, '""')}"`;
        })
        .join(',')
    )
    .join('\n');
  const csv = headers + '\n' + rows;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  createLink(blob, filename);
}

export function exportExcel(
  columns: Column[],
  data: any[],
  filename = 'export.xls',
  sheetName = 'Sheet1'
) {
  const headerHtml = columns.map(c => `<th>${c.header}</th>`).join('');
  const bodyHtml = data
    .map(row =>
      '<tr>' +
      columns.map(c => `<td>${row[c.field] ?? ''}</td>`).join('') +
      '</tr>'
    )
    .join('');
  const html = `<table><thead><tr>${headerHtml}</tr></thead><tbody>${bodyHtml}</tbody></table>`;
  const blob = new Blob([html], {
    type: 'application/vnd.ms-excel;charset=utf-8;',
  });
  createLink(blob, filename);
}
