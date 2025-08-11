export interface Budget {
  id: string;
  name: string;
  percentageUsed: number;
  spent: number;
  total: number;
}

export interface ActiveBudgetsProps {
  budgets: Budget[];
  formatCurrency: (amount: number) => string;
}
