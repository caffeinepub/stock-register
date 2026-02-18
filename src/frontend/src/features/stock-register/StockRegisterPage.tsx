import { useState, useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { RegisterRow, ReportLayout } from './types';
import { useRegisterFilters } from './state/useRegisterFilters';
import { DateNavigator } from './components/DateNavigator';
import { RegisterActionsBar } from './components/RegisterActionsBar';
import { StockRegisterGrid } from './components/StockRegisterGrid';
import { MonthlyMatrixTable } from './monthlyMatrix/MonthlyMatrixTable';
import { PrintView } from './print/PrintView';
import { exportToXlsx } from './export/exportXlsx';
import { calculateTotalQuantity, calculateClosingStock } from './gridMath';
import { formatYMD, matchesYearMonth, matchesYearMonthDay, compareDateStrings } from './dateUtils';
import { buildMonthlyMatrix, getUniqueItemNames } from './monthlyMatrix/monthlyMatrix';
import { SiFacebook, SiX, SiLinkedin, SiInstagram } from 'react-icons/si';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export function StockRegisterPage() {
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { filters, setYear, setMonth, setFocusedDay } = useRegisterFilters();
  const [rows, setRows] = useState<RegisterRow[]>([]);
  const [isPrintMode, setIsPrintMode] = useState(false);
  const [layout, setLayout] = useState<ReportLayout>('row');
  const printRef = useRef<HTMLDivElement>(null);

  // Filter rows for the selected month (always full month for matrix, focused day for row view)
  const monthRows = rows.filter((row) => matchesYearMonth(row.date, filters.year, filters.month));
  
  // For on-screen row view, apply focused day filter if set
  const filteredRows = layout === 'row' && filters.focusedDay !== undefined
    ? rows.filter((row) => matchesYearMonthDay(row.date, filters.year, filters.month, filters.focusedDay!))
    : monthRows;

  // Sort rows by date using string comparison
  const sortedRows = [...filteredRows].sort((a, b) => compareDateStrings(a.date, b.date));

  // For matrix view, always use full month data
  const matrixRows = [...monthRows].sort((a, b) => compareDateStrings(a.date, b.date));
  const matrix = layout === 'matrix' ? buildMonthlyMatrix(matrixRows, filters.year, filters.month) : [];
  const itemNames = layout === 'matrix' ? getUniqueItemNames(matrixRows) : [];

  const handleLogout = async () => {
    // Clear all cached data
    queryClient.clear();
    // Clear identity and return to login screen
    await clear();
  };

  const handleAddItem = () => {
    // Create date string directly from year/month/day without timezone conversion
    const newDate = filters.focusedDay !== undefined
      ? formatYMD(filters.year, filters.month, filters.focusedDay)
      : formatYMD(filters.year, filters.month, 1);

    const newRow: RegisterRow = {
      id: `row-${Date.now()}-${Math.random()}`,
      date: newDate,
      itemName: '',
      openingStock: 0,
      purchase: 0,
      totalQuantity: 0,
      sales: 0,
      price: 0,
      closingStock: 0,
    };

    setRows((prev) => [newRow, ...prev]);
  };

  const handleRowChange = (id: string, field: keyof RegisterRow, value: any) => {
    setRows((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;

        const updatedRow = { ...row, [field]: value };

        // Auto-calculate total quantity if not manually overridden
        if ((field === 'openingStock' || field === 'purchase') && !row.manualTotalQuantity) {
          updatedRow.totalQuantity = calculateTotalQuantity(updatedRow.openingStock, updatedRow.purchase);
        }

        // Auto-calculate closing stock if not manually overridden
        if ((field === 'totalQuantity' || field === 'sales') && !row.manualClosingStock) {
          updatedRow.closingStock = calculateClosingStock(updatedRow.totalQuantity, updatedRow.sales);
        }

        // If user manually edits total quantity or closing stock, mark as manual
        if (field === 'totalQuantity') {
          updatedRow.manualTotalQuantity = true;
        }
        if (field === 'closingStock') {
          updatedRow.manualClosingStock = true;
        }

        return updatedRow;
      })
    );
  };

  const handleDeleteRow = (id: string) => {
    setRows((prev) => prev.filter((row) => row.id !== id));
  };

  const handlePrint = () => {
    setIsPrintMode(true);
    setTimeout(() => {
      window.print();
      setIsPrintMode(false);
    }, 100);
  };

  const handleExport = () => {
    try {
      // Always export full month data (not filtered by focused day)
      const exportRows = [...monthRows].sort((a, b) => compareDateStrings(a.date, b.date));
      exportToXlsx(exportRows, filters.year, filters.month, layout);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  // Load sample data on mount (in production, this would load from backend)
  useEffect(() => {
    const sampleRows: RegisterRow[] = [
      {
        id: 'sample-1',
        date: formatYMD(filters.year, filters.month, 1),
        itemName: 'Product A',
        openingStock: 100,
        purchase: 50,
        totalQuantity: 150,
        sales: 30,
        price: 25.5,
        closingStock: 120,
      },
      {
        id: 'sample-2',
        date: formatYMD(filters.year, filters.month, 2),
        itemName: 'Product B',
        openingStock: 200,
        purchase: 75,
        totalQuantity: 275,
        sales: 50,
        price: 15.75,
        closingStock: 225,
      },
      {
        id: 'sample-3',
        date: formatYMD(filters.year, filters.month, 1),
        itemName: 'Product B',
        openingStock: 150,
        purchase: 25,
        totalQuantity: 175,
        sales: 40,
        price: 15.75,
        closingStock: 135,
      },
      {
        id: 'sample-4',
        date: formatYMD(filters.year, filters.month, 3),
        itemName: 'Product A',
        openingStock: 120,
        purchase: 30,
        totalQuantity: 150,
        sales: 25,
        price: 25.5,
        closingStock: 125,
      },
    ];
    setRows(sampleRows);
  }, []);

  if (isPrintMode) {
    return (
      <div ref={printRef}>
        <PrintView 
          rows={matrixRows} 
          year={filters.year} 
          month={filters.month} 
          layout={layout}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Stock Register</h1>
              <p className="text-sm text-muted-foreground">Daily inventory tracking and management</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Date Navigation */}
        <div className="bg-card border rounded-lg p-4">
          <DateNavigator
            year={filters.year}
            month={filters.month}
            focusedDay={filters.focusedDay}
            onYearChange={setYear}
            onMonthChange={setMonth}
            onFocusedDayChange={setFocusedDay}
          />
        </div>

        {/* Actions Bar */}
        <div className="bg-card border rounded-lg p-4">
          <RegisterActionsBar
            onAddItem={handleAddItem}
            onPrint={handlePrint}
            onExport={handleExport}
            disabled={false}
            layout={layout}
            onLayoutChange={setLayout}
          />
        </div>

        {/* Register Grid or Matrix */}
        <div className="bg-card rounded-lg p-4">
          {layout === 'matrix' ? (
            <MonthlyMatrixTable matrix={matrix} itemNames={itemNames} isPrintMode={false} />
          ) : (
            <StockRegisterGrid
              rows={sortedRows}
              onRowChange={handleRowChange}
              onDeleteRow={handleDeleteRow}
              isPrintMode={false}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Stock Register. All rights reserved.
            </div>
            <div className="text-sm text-muted-foreground">
              Built with ❤️ using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.hostname : 'stock-register'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                caffeine.ai
              </a>
            </div>
            <div className="flex items-center gap-3">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <SiFacebook className="h-4 w-4" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <SiX className="h-4 w-4" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <SiLinkedin className="h-4 w-4" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <SiInstagram className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
