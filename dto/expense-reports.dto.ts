export interface ExpenseReportsProps {
  expenses: Array<{
    id: string;
    amount: number;
    description: string;
    category: string;
    date: string;
    status?: string;
  }>;
  onAddExpense: () => void;
  onDeleteExpense: (id: string) => void;
}
