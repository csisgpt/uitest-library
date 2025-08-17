export type Row = {
  id: number;
  name: string;
  email: string;
  age: number;
  country: 'IR'|'DE'|'US'|'FR'|'JP';
  active: boolean;
};

export const COUNTRIES = ['IR', 'DE', 'US', 'FR', 'JP'] as const;

export function makeRows(n = 1000): Row[] {
  return Array.from({ length: n }).map((_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@mail.com`,
    age: 18 + (i % 40),
    country: COUNTRIES[i % COUNTRIES.length],
    active: i % 3 === 0,
  }));
}

export const baseColumns = [
  { id: 'name', header: 'نام', field: 'name', sortable: true, filter: { kind: 'text', operator: 'contains', label: 'نام' }, sticky: 'left' },
  { id: 'email', header: 'ایمیل', field: 'email', sortable: true, filter: { kind: 'text', operator: 'contains' } },
  { id: 'age', header: 'سن', field: 'age', align: 'end', sortable: true, filter: { kind: 'number' } },
  { id: 'active', header: 'فعال', field: 'active', sortable: true, filter: { kind: 'boolean' } },
  { id: 'country', header: 'کشور', field: 'country', filter: { kind: 'enum', options: COUNTRIES.map(c => ({ label: c, value: c })) }, sticky: 'right' },
];

/** Fake server query contract */
export async function fakeServerFetch(q: {
  page: number; pageSize: number;
  sort: { id: string; desc?: boolean }[];
  filters: Record<string, any>;
  global?: string;
}) {
  const all = makeRows(5000);

  // global search
  let filtered = q.global
    ? all.filter(r =>
        r.name.toLowerCase().includes(q.global!.toLowerCase()) ||
        r.email.toLowerCase().includes(q.global!.toLowerCase()))
    : all;

  // simple filters (demo only)
  if (q.filters.country) filtered = filtered.filter(r => r.country === q.filters.country);
  if (q.filters.active != null) filtered = filtered.filter(r => r.active === q.filters.active);
  if (q.filters.age) {
    const { min, max } = q.filters.age;
    filtered = filtered.filter(r => (min ? r.age >= min : true) && (max ? r.age <= max : true));
  }

  // sorting
  if (q.sort?.length) {
    const s = q.sort[0];
    filtered.sort((a: any, b: any) => {
      const va = a[s.id]; const vb = b[s.id];
      if (va === vb) return 0;
      const res = va > vb ? 1 : -1;
      return s.desc ? -res : res;
    });
  }

  const total = filtered.length;
  const start = (q.page - 1) * q.pageSize;
  const rows = filtered.slice(start, start + q.pageSize);

  // simulate latency
  await new Promise(r => setTimeout(r, 300));
  return { rows, total };
}
