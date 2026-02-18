import { RegisterRow, ReportLayout } from '../types';
import { StockRegisterGrid } from '../components/StockRegisterGrid';
import { MonthlyMatrixTable } from '../monthlyMatrix/MonthlyMatrixTable';
import { buildMonthlyMatrix, getUniqueItemNames } from '../monthlyMatrix/monthlyMatrix';

interface PrintViewProps {
  rows: RegisterRow[];
  year: number;
  month: number;
  title?: string;
  layout: ReportLayout;
}

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

export function PrintView({ rows, year, month, title = 'Stock Register', layout }: PrintViewProps) {
  const matrix = layout === 'matrix' ? buildMonthlyMatrix(rows, year, month) : [];
  const itemNames = layout === 'matrix' ? getUniqueItemNames(rows) : [];

  return (
    <div className="print-view p-8">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-2">{title}</h1>
        <p className="text-lg text-muted-foreground">
          {MONTHS[month - 1]} {year}
        </p>
      </div>
      
      {layout === 'matrix' ? (
        <MonthlyMatrixTable matrix={matrix} itemNames={itemNames} isPrintMode={true} />
      ) : (
        <StockRegisterGrid rows={rows} onRowChange={() => {}} onDeleteRow={() => {}} isPrintMode={true} />
      )}
      
      <div className="mt-8 text-sm text-muted-foreground text-center">
        Generated on {new Date().toLocaleDateString()}
      </div>
    </div>
  );
}
