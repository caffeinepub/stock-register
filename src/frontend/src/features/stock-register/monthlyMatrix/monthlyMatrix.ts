import { RegisterRow } from '../types';
import { getDaysInMonth, parseYMD } from '../dateUtils';

export interface MatrixData {
  day: number;
  items: Map<string, MatrixItemData>;
}

export interface MatrixItemData {
  openingStock: number;
  purchase: number;
  totalQuantity: number;
  sales: number;
  price: number;
  closingStock: number;
}

/**
 * Get unique item names from rows for the selected month
 */
export function getUniqueItemNames(rows: RegisterRow[]): string[] {
  const itemNames = new Set<string>();
  rows.forEach((row) => {
    if (row.itemName.trim()) {
      itemNames.add(row.itemName);
    }
  });
  return Array.from(itemNames).sort();
}

/**
 * Build matrix data structure: day -> itemName -> values
 */
export function buildMonthlyMatrix(rows: RegisterRow[], year: number, month: number): MatrixData[] {
  const daysInMonth = getDaysInMonth(year, month);
  const matrix: MatrixData[] = [];

  // Initialize all days
  for (let day = 1; day <= daysInMonth; day++) {
    matrix.push({
      day,
      items: new Map(),
    });
  }

  // Populate with data from rows
  rows.forEach((row) => {
    const { day } = parseYMD(row.date);
    if (day >= 1 && day <= daysInMonth && row.itemName.trim()) {
      const dayData = matrix[day - 1];
      dayData.items.set(row.itemName, {
        openingStock: row.openingStock,
        purchase: row.purchase,
        totalQuantity: row.totalQuantity,
        sales: row.sales,
        price: row.price,
        closingStock: row.closingStock,
      });
    }
  });

  return matrix;
}

/**
 * Build CSV rows for matrix export
 */
export function buildMatrixCSVRows(
  matrix: MatrixData[],
  itemNames: string[]
): string[][] {
  const rows: string[][] = [];

  // Build two header rows
  const headerRow1: string[] = ['Day'];
  const headerRow2: string[] = [''];

  itemNames.forEach((itemName) => {
    // Add item name spanning 6 columns
    headerRow1.push(itemName, '', '', '', '', '');
    // Add sub-column headers
    headerRow2.push('Opening Stock', 'Purchase', 'Total Quantity', 'Sales', 'Price', 'Closing Stock');
  });

  rows.push(headerRow1);
  rows.push(headerRow2);

  // Build data rows
  matrix.forEach((dayData) => {
    const row: string[] = [dayData.day.toString()];
    
    itemNames.forEach((itemName) => {
      const itemData = dayData.items.get(itemName);
      if (itemData) {
        row.push(
          itemData.openingStock.toFixed(2),
          itemData.purchase.toFixed(2),
          itemData.totalQuantity.toFixed(2),
          itemData.sales.toFixed(2),
          itemData.price.toFixed(2),
          itemData.closingStock.toFixed(2)
        );
      } else {
        // Empty cells for missing data
        row.push('', '', '', '', '', '');
      }
    });

    rows.push(row);
  });

  return rows;
}
