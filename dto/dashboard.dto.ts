export interface DashboardData {
  summary: {
    monthlyIncome: number;
    monthlyExpenses: number;
    netIncome: number;
    totalTransactions: number;
    totalCategories: number;
    totalBudgets: number;
  };
  expensesByCategory: Array<{
    name: string;
    amount: number;
    color: string;
    icon: string;
  }>;
  recentTransactions: Array<{
    id: string;
    amount: number;
    description: string;
    category: string;
    date: string;
    type: string;
    merchant?: string;
  }>;
  budgetProgress: Array<{
    id: string;
    name: string;
    category: string;
    spent: number;
    total: number;
    remaining: number;
    percentageUsed: number;
    color: string;
    period: string;
  }>;
  monthlyTrend: {
    income: number;
    expenses: number;
    month: string;
  };
}
