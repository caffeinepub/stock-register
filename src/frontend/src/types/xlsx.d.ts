declare module 'xlsx' {
  export interface WorkBook {
    SheetNames: string[];
    Sheets: { [sheet: string]: WorkSheet };
  }

  export interface WorkSheet {
    [cell: string]: CellObject | any;
    '!ref'?: string;
    '!cols'?: ColInfo[];
    '!merges'?: Range[];
  }

  export interface CellObject {
    v: string | number | boolean | Date;
    w?: string;
    t: 'b' | 'n' | 'e' | 's' | 'd' | 'z';
    f?: string;
    r?: string;
    h?: string;
    c?: string;
    z?: string;
  }

  export interface ColInfo {
    wch?: number;
    wpx?: number;
    hidden?: boolean;
  }

  export interface Range {
    s: { c: number; r: number };
    e: { c: number; r: number };
  }

  export interface WritingOptions {
    bookType?: 'xlsx' | 'xlsm' | 'xlsb' | 'xls' | 'csv' | 'txt' | 'html';
    type?: 'base64' | 'binary' | 'buffer' | 'file' | 'array' | 'string';
    compression?: boolean;
  }

  export interface ParsingOptions {
    type?: 'base64' | 'binary' | 'buffer' | 'file' | 'array' | 'string';
    cellDates?: boolean;
    cellNF?: boolean;
    cellText?: boolean;
  }

  export const utils: {
    book_new(): WorkBook;
    book_append_sheet(workbook: WorkBook, worksheet: WorkSheet, name?: string): void;
    json_to_sheet<T>(data: T[], opts?: any): WorkSheet;
    sheet_to_json<T>(worksheet: WorkSheet, opts?: any): T[];
    aoa_to_sheet(data: any[][], opts?: any): WorkSheet;
    sheet_to_csv(worksheet: WorkSheet, opts?: any): string;
    sheet_to_html(worksheet: WorkSheet, opts?: any): string;
    encode_cell(cell: { c: number; r: number }): string;
    encode_range(range: Range): string;
    decode_cell(address: string): { c: number; r: number };
    decode_range(range: string): Range;
  };

  export function read(data: any, opts?: ParsingOptions): WorkBook;
  export function readFile(filename: string, opts?: ParsingOptions): WorkBook;
  export function write(workbook: WorkBook, opts?: WritingOptions): any;
  export function writeFile(workbook: WorkBook, filename: string, opts?: WritingOptions): void;
  export function writeFileXLSX(workbook: WorkBook, filename: string, opts?: WritingOptions): void;
}
