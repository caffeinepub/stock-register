import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Printer, Download } from 'lucide-react';
import { ReportLayout } from '../types';

interface RegisterActionsBarProps {
  onAddItem: () => void;
  onPrint: () => void;
  onExport: () => void;
  disabled?: boolean;
  layout: ReportLayout;
  onLayoutChange: (layout: ReportLayout) => void;
}

export function RegisterActionsBar({ 
  onAddItem, 
  onPrint, 
  onExport, 
  disabled,
  layout,
  onLayoutChange 
}: RegisterActionsBarProps) {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      <div className="flex items-center gap-2">
        <Button onClick={onAddItem} disabled={disabled} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Item
        </Button>
        <Button onClick={onPrint} variant="outline" disabled={disabled} className="gap-2">
          <Printer className="h-4 w-4" />
          Print
        </Button>
        <Button onClick={onExport} variant="outline" disabled={disabled} className="gap-2">
          <Download className="h-4 w-4" />
          Export to CSV
        </Button>
      </div>
      
      <div className="flex items-center gap-2 ml-auto">
        <span className="text-sm text-muted-foreground">Layout:</span>
        <Select value={layout} onValueChange={(v) => onLayoutChange(v as ReportLayout)}>
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="row">Row View</SelectItem>
            <SelectItem value="matrix">Matrix View</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
