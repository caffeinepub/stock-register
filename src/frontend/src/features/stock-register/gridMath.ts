export function calculateTotalQuantity(openingStock: number, purchase: number): number {
  return openingStock + purchase;
}

export function calculateClosingStock(totalQuantity: number, sales: number): number {
  return totalQuantity - sales;
}

export function parseNumber(value: string | number): number {
  if (typeof value === 'number') return value;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
}

export function formatNumber(value: number, decimals: number = 2): string {
  return value.toFixed(decimals);
}

export function formatCurrency(value: number): string {
  return value.toFixed(2);
}
