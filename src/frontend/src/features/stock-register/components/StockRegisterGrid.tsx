import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { RegisterRow } from '../types';
import { formatNumber } from '../gridMath';
import { formatDateForDisplay } from '../dateUtils';

interface StockRegisterGridProps {
  rows: RegisterRow[];
  onRowChange: (id: string, field: keyof RegisterRow, value: any) => void;
  onDeleteRow: (id: string) => void;
  isPrintMode?: boolean;
}

export function StockRegisterGrid({ rows, onRowChange, onDeleteRow, isPrintMode = false }: StockRegisterGridProps) {
  const handleNumberInput = (id: string, field: keyof RegisterRow, value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    if (!isNaN(numValue)) {
      onRowChange(id, field, numValue);
    }
  };

  return (
    <div className="border rounded-md overflow-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold text-center border-r">Date</TableHead>
            <TableHead className="font-semibold border-r">Item</TableHead>
            <TableHead className="font-semibold text-right border-r">Opening Stock</TableHead>
            <TableHead className="font-semibold text-right border-r">Purchase</TableHead>
            <TableHead className="font-semibold text-right border-r">Total Quantity</TableHead>
            <TableHead className="font-semibold text-right border-r">Sales</TableHead>
            <TableHead className="font-semibold text-right border-r">Price</TableHead>
            <TableHead className="font-semibold text-right border-r">Closing Stock</TableHead>
            {!isPrintMode && <TableHead className="font-semibold text-center w-[80px]">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={isPrintMode ? 8 : 9} className="text-center text-muted-foreground py-8">
                No entries found. Click "Add Item" to create a new entry.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow key={row.id} className="hover:bg-muted/30">
                <TableCell className="text-center border-r">
                  {isPrintMode ? (
                    <span className="text-sm">{formatDateForDisplay(row.date)}</span>
                  ) : (
                    <Input
                      type="date"
                      value={row.date}
                      onChange={(e) => onRowChange(row.id, 'date', e.target.value)}
                      className="w-[140px] text-sm"
                    />
                  )}
                </TableCell>
                <TableCell className="border-r">
                  {isPrintMode ? (
                    <span className="text-sm">{row.itemName}</span>
                  ) : (
                    <Input
                      type="text"
                      value={row.itemName}
                      onChange={(e) => onRowChange(row.id, 'itemName', e.target.value)}
                      placeholder="Item name"
                      className="min-w-[150px]"
                    />
                  )}
                </TableCell>
                <TableCell className="text-right border-r">
                  {isPrintMode ? (
                    <span className="text-sm tabular-nums">{formatNumber(row.openingStock)}</span>
                  ) : (
                    <Input
                      type="number"
                      step="0.01"
                      value={row.openingStock}
                      onChange={(e) => handleNumberInput(row.id, 'openingStock', e.target.value)}
                      className="w-[100px] text-right tabular-nums"
                    />
                  )}
                </TableCell>
                <TableCell className="text-right border-r">
                  {isPrintMode ? (
                    <span className="text-sm tabular-nums">{formatNumber(row.purchase)}</span>
                  ) : (
                    <Input
                      type="number"
                      step="0.01"
                      value={row.purchase}
                      onChange={(e) => handleNumberInput(row.id, 'purchase', e.target.value)}
                      className="w-[100px] text-right tabular-nums"
                    />
                  )}
                </TableCell>
                <TableCell className="text-right border-r bg-muted/20">
                  {isPrintMode ? (
                    <span className="text-sm tabular-nums font-medium">{formatNumber(row.totalQuantity)}</span>
                  ) : (
                    <Input
                      type="number"
                      step="0.01"
                      value={row.totalQuantity}
                      onChange={(e) => handleNumberInput(row.id, 'totalQuantity', e.target.value)}
                      className="w-[100px] text-right tabular-nums font-medium"
                      readOnly={!row.manualTotalQuantity}
                      title={row.manualTotalQuantity ? 'Manual override' : 'Auto-calculated'}
                    />
                  )}
                </TableCell>
                <TableCell className="text-right border-r">
                  {isPrintMode ? (
                    <span className="text-sm tabular-nums">{formatNumber(row.sales)}</span>
                  ) : (
                    <Input
                      type="number"
                      step="0.01"
                      value={row.sales}
                      onChange={(e) => handleNumberInput(row.id, 'sales', e.target.value)}
                      className="w-[100px] text-right tabular-nums"
                    />
                  )}
                </TableCell>
                <TableCell className="text-right border-r">
                  {isPrintMode ? (
                    <span className="text-sm tabular-nums">{formatNumber(row.price, 2)}</span>
                  ) : (
                    <Input
                      type="number"
                      step="0.01"
                      value={row.price}
                      onChange={(e) => handleNumberInput(row.id, 'price', e.target.value)}
                      className="w-[100px] text-right tabular-nums"
                    />
                  )}
                </TableCell>
                <TableCell className="text-right border-r bg-muted/20">
                  {isPrintMode ? (
                    <span className="text-sm tabular-nums font-medium">{formatNumber(row.closingStock)}</span>
                  ) : (
                    <Input
                      type="number"
                      step="0.01"
                      value={row.closingStock}
                      onChange={(e) => handleNumberInput(row.id, 'closingStock', e.target.value)}
                      className="w-[100px] text-right tabular-nums font-medium"
                      readOnly={!row.manualClosingStock}
                      title={row.manualClosingStock ? 'Manual override' : 'Auto-calculated'}
                    />
                  )}
                </TableCell>
                {!isPrintMode && (
                  <TableCell className="text-center">
                    <Button variant="ghost" size="icon" onClick={() => onDeleteRow(row.id)} className="h-8 w-8">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
