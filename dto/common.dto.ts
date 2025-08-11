
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

export interface RecurringBill {
  id: string;
  name: string;
  amount: number;
  category: string;
  categoryColor: string | null;
  frequency: string;
  nextDueDate: string;
  lastPaidDate: string;
  merchant: string | null;
  status: string;
  occurrences: number;
  averageAmount: number;
}

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  type: 'INCOME' | 'EXPENSE';
  status?: string;
  merchant?: string;
}


export interface Budget {
  id: string;
  name: string;
  amount: number;
  spent: number;
  remaining: number;
  percentageUsed: number;
  period: string;
  category?: {
    name: string;
    color: string;
  } | null;
}

export interface CategorySummary {
  name: string;
  totalAmount: number;
  transactionCount: number;
  averageTransaction: number;
  percentage: number;
}
