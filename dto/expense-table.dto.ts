import { ExpenseReportsProps } from './expense-reports.dto';

export interface ExpenseTableProps {
  expenses: ExpenseReportsProps['expenses'];
  selectedExpenses: string[];
  page: number;
  rowsPerPage: number;
  handleSelectExpense: (expenseId: string) => void;
  handleSelectAll: () => void;
  handleMenuClick: (event: React.MouseEvent<HTMLElement>, expenseId: string) => void;
  setPage: (page: number) => void;
  setRowsPerPage: (rows: number) => void;
}
