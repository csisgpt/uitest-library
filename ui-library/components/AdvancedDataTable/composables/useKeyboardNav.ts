export function useKeyboardNav(next: () => void, prev: () => void) {
  function onKey(e: KeyboardEvent) { if (e.key === 'PageDown') { next(); e.preventDefault(); } if (e.key === 'PageUp') { prev(); e.preventDefault(); } }
  return { onKey };
}
