// datasetGenerator.ts - Creates large datasets for performance testing
import type { Column } from "../types";

export interface EmployeeRow {
  id: number;
  name: string;
  salary: number;
  hireDate: string;
  active: boolean;
  resume: string;
}

const firstNames = [
  "Ali",
  "Sara",
  "Hossein",
  "Reza",
  "Mina",
  "Neda",
  "Hassan",
  "Leila",
];
const lastNames = [
  "Rezaei",
  "Ahmadi",
  "Karimi",
  "Hosseini",
  "Moradi",
  "Mohammadi",
];

function randomName() {
  const f = firstNames[Math.floor(Math.random() * firstNames.length)];
  const l = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${f} ${l}`;
}

export function generateDataset(count = 50000): EmployeeRow[] {
  const rows: EmployeeRow[] = [];
  for (let i = 0; i < count; i++) {
    rows.push({
      id: i + 1,
      name: randomName(),
      salary: Math.floor(Math.random() * 100000000) + 1000000,
      hireDate: new Date(
        Date.now() - Math.floor(Math.random() * 5 * 365 * 24 * 60 * 60 * 1000)
      )
        .toISOString()
        .slice(0, 10),
      active: Math.random() > 0.5,
      resume: "#",
    });
  }
  return rows;
}

export const datasetColumns: Column[] = [
  { field: "id", header: "ID", type: "number", sortable: true, align: "right" },
  {
    field: "name",
    header: "Full Name",
    type: "text",
    sortable: true,
    filterable: true,
    filterType: "text",
  },
  {
    field: "salary",
    header: "Salary",
    type: "currency",
    sortable: true,
    formatOptions: { currency: "IRR" },
    align: "right",
    filterable: false,
    filterType: "number",
  },
  {
    field: "hireDate",
    header: "Hire Date",
    type: "date-fa",
    sortable: true,
    filterable: true,
    filterType: "date",
  },
  {
    field: "active",
    header: "Active",
    type: "boolean",
    sortable: true,
    filterable: true,
    filterType: "boolean",
  },
  { field: "resume", header: "Resume", type: "file" },
];
