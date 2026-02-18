export interface RegisterRow {
  id: string;
  date: string; // ISO date string YYYY-MM-DD
  itemName: string;
  openingStock: number;
  purchase: number;
  totalQuantity: number;
  sales: number;
  price: number;
  closingStock: number;
  // UI flags
  manualTotalQuantity?: boolean;
  manualClosingStock?: boolean;
}

export interface RegisterFilters {
  year: number;
  month: number; // 1-12
  focusedDay?: number; // 1-31
}

export type ReportLayout = 'row' | 'matrix';
