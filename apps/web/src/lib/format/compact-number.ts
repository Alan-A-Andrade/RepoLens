const formatter = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

/** 1234 → "1.2K", 98765 → "98.8K". Locale is fixed so server and client agree. */
export function formatCompactNumber(value: number): string {
  return formatter.format(value);
}
