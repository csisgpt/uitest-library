// a11yUtils.ts - Helpers for keyboard navigation and accessibility
export function focusRow(rows: HTMLElement[], index: number) {
  if (index < 0 || index >= rows.length) return;
  rows[index].focus();
}

export function handleTableKeydown(
  e: KeyboardEvent,
  rows: HTMLElement[],
  index: number
) {
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    focusRow(rows, index + 1);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    focusRow(rows, index - 1);
  }
}
