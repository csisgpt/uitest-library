// formatters.ts - Helper formatting functions for AdvancedDataTable

export function formatNumber(value: number, locale = 'fa-IR', options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(locale, options).format(value);
}

export function formatCurrency(
  value: number,
  currency: string = 'IRR',
  locale = 'fa-IR',
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency, ...options }).format(value);
}

export function formatDate(
  value: string | number | Date,
  locale = 'en-US',
  options?: Intl.DateTimeFormatOptions
): string {
  return new Intl.DateTimeFormat(locale, options).format(new Date(value));
}

export function formatDateFa(value: string | number | Date, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat('fa-IR-u-ca-persian', options).format(new Date(value));
}

export function formatBoolean(value: boolean): string {
  return value ? '✔︎' : '✘';
}
