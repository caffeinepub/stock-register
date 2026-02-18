import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MatrixData } from './monthlyMatrix';

interface MonthlyMatrixTableProps {
  matrix: MatrixData[];
  itemNames: string[];
  isPrintMode?: boolean;
}

export function MonthlyMatrixTable({ matrix, itemNames, isPrintMode = false }: MonthlyMatrixTableProps) {
  if (itemNames.length === 0) {
    return (
      <div className="border rounded-md p-8 text-center text-muted-foreground">
        No items found for this month. Add items to see the matrix view.
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-auto">
      <Table>
        <TableHeader>
          {/* First header row: Item names */}
          <TableRow className="bg-muted/50">
            <TableHead rowSpan={2} className="font-semibold text-center border-r align-middle">
              Day
            </TableHead>
            {itemNames.map((itemName) => (
              <TableHead
                key={itemName}
                colSpan={6}
                className="font-semibold text-center border-r"
              >
                {itemName}
              </TableHead>
            ))}
          </TableRow>
          {/* Second header row: Sub-columns */}
          <TableRow className="bg-muted/50">
            {itemNames.map((itemName) => (
              <React.Fragment key={`${itemName}-headers`}>
                <TableHead className="font-semibold text-right text-xs border-r">Opening Stock</TableHead>
                <TableHead className="font-semibold text-right text-xs border-r">Purchase</TableHead>
                <TableHead className="font-semibold text-right text-xs border-r">Total Quantity</TableHead>
                <TableHead className="font-semibold text-right text-xs border-r">Sales</TableHead>
                <TableHead className="font-semibold text-right text-xs border-r">Price</TableHead>
                <TableHead className="font-semibold text-right text-xs border-r">Closing Stock</TableHead>
              </React.Fragment>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {matrix.map((dayData) => (
            <TableRow key={dayData.day} className="hover:bg-muted/30">
              <TableCell className="text-center font-medium border-r">
                {dayData.day}
              </TableCell>
              {itemNames.map((itemName) => {
                const itemData = dayData.items.get(itemName);
                return (
                  <React.Fragment key={`${dayData.day}-${itemName}`}>
                    <TableCell className="text-right text-sm tabular-nums border-r">
                      {itemData ? itemData.openingStock.toFixed(2) : ''}
                    </TableCell>
                    <TableCell className="text-right text-sm tabular-nums border-r">
                      {itemData ? itemData.purchase.toFixed(2) : ''}
                    </TableCell>
                    <TableCell className="text-right text-sm tabular-nums border-r bg-muted/20">
                      {itemData ? itemData.totalQuantity.toFixed(2) : ''}
                    </TableCell>
                    <TableCell className="text-right text-sm tabular-nums border-r">
                      {itemData ? itemData.sales.toFixed(2) : ''}
                    </TableCell>
                    <TableCell className="text-right text-sm tabular-nums border-r">
                      {itemData ? itemData.price.toFixed(2) : ''}
                    </TableCell>
                    <TableCell className="text-right text-sm tabular-nums border-r bg-muted/20">
                      {itemData ? itemData.closingStock.toFixed(2) : ''}
                    </TableCell>
                  </React.Fragment>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// Add React import for Fragment
import React from 'react';
