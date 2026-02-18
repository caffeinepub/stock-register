# Specification

## Summary
**Goal:** Add a new monthly “matrix” report layout (Days x Items) that can be printed as one document and exported as an Excel-compatible file.

**Planned changes:**
- Add a monthly layout selector to switch between the existing row-based layout and a new matrix layout for the selected month/year.
- Implement the matrix layout rendering: day numbers (1..daysInMonth) as rows; each unique itemName as a grouped column header with 6 sub-columns (Opening Stock, Purchase, Total Quantity, Sales, Price, Closing Stock), using English labels and blank cells when no day+item data exists.
- Update print flow for the matrix layout to produce a single print-ready document for the full month, with an English month/year header and print-friendly styling (including clean page breaks and repeated headers where applicable).
- Update export flow to download an Excel-compatible file (CSV acceptable) for the matrix layout, including two header rows and a filename containing the selected English month and year.
- Ensure existing month/year navigation drives the matrix output for any month/year (including correct 28/29 days for February) and that matrix layout always renders the full month regardless of any Focus Day setting.

**User-visible outcome:** Users can select a month and choose a new matrix-style monthly report to print as one continuous document and export as an Excel-compatible file, with day-by-day rows and item-by-item grouped columns.
