export interface StatCardsProps {
  summary: {
    monthlyIncome: number;
    monthlyExpenses: number;
    netIncome: number;
    totalTransactions: number;
  };
  formatCurrency: (amount: number) => string;
}
