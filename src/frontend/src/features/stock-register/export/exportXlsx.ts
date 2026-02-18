import { RegisterRow, ReportLayout } from '../types';
import { formatNumber } from '../gridMath';
import { formatDateForDisplay } from '../dateUtils';
import { buildMonthlyMatrix, getUniqueItemNames, buildMatrixCSVRows } from '../monthlyMatrix/monthlyMatrix';

export function exportToXlsx(
  rows: RegisterRow[], 
  year: number, 
  month: number, 
  layout: ReportLayout,
  fileName?: string
) {
  const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  let csvRows: string[][];
  let defaultFileName: string;

  if (layout === 'matrix') {
    // Matrix layout export
    const matrix = buildMonthlyMatrix(rows, year, month);
    const itemNames = getUniqueItemNames(rows);
    csvRows = buildMatrixCSVRows(matrix, itemNames);
    defaultFileName = `Stock_Register_${MONTHS[month - 1]}_${year}_Matrix.csv`;
  } else {
    // Row layout export (existing behavior)
    const headers = ['Date', 'Item', 'Opening Stock', 'Purchase', 'Total Quantity', 'Sales', 'Price', 'Closing Stock'];
    
    const dataRows = rows.map((row) => [
      formatDateForDisplay(row.date),
      row.itemName,
      formatNumber(row.openingStock),
      formatNumber(row.purchase),
      formatNumber(row.totalQuantity),
      formatNumber(row.sales),
      formatNumber(row.price, 2),
      formatNumber(row.closingStock),
    ]);

    csvRows = [headers, ...dataRows];
    defaultFileName = `Stock_Register_${MONTHS[month - 1]}_${year}.csv`;
  }

  // Escape CSV values
  const escapeCSV = (value: string) => {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };

  // Build CSV content
  const csvContent = csvRows.map(row => row.map(String).map(escapeCSV).join(',')).join('\n');

  // Add BOM for Excel UTF-8 support
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

  // Generate filename
  const finalFileName = fileName || defaultFileName;

  // Create download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', finalFileName);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
