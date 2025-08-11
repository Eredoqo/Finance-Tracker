import { ExpenseTableProps } from "./expense-table.dto";

export interface ExpenseTableDataGridProps {
  expenses: ExpenseTableProps['expenses'];
  onDeleteExpense?: (id: string) => void;
    page: number;
    rowsPerPage: number;
    selectedExpenses: string[];
    handleSelectExpense: (expenseId: string) => void;
    handleSelectAll: () => void;
    handleMenuClick: (event: React.MouseEvent<HTMLElement>, expenseId: string) => void;
    setPage: (page: number) => void;
    setRowsPerPage: (rowsPerPage: number) => void;
}