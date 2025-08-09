import { TransactionType } from '@prisma/client';

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  averageTransaction: number;
  transactionCount: number;
}

export interface BudgetAnalysis {
  budgetAmount: number;
  spent: number;
  remaining: number;
  percentageUsed: number;
  isOverBudget: boolean;
  daysRemaining: number;
  dailyBudget: number;
  projectedSpending: number;
}

// Calculate financial summary from transactions
export function calculateFinancialSummary(
  transactions: Array<{ amount: number; type: TransactionType }>
): FinancialSummary {
  const income = transactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + Number(t.amount), 0);
  
  const expenses = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const netIncome = income - expenses;
  const transactionCount = transactions.length;
  const averageTransaction = transactionCount > 0 
    ? (income + expenses) / transactionCount 
    : 0;

  return {
    totalIncome: income,
    totalExpenses: expenses,
    netIncome,
    averageTransaction,
    transactionCount,
  };
}

// Analyze budget performance
export function analyzeBudget(
  budgetAmount: number,
  spent: number,
  startDate: Date,
  endDate: Date
): BudgetAnalysis {
  const remaining = budgetAmount - spent;
  const percentageUsed = budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0;
  const isOverBudget = spent > budgetAmount;
  
  const now = new Date();
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysElapsed = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysRemaining = Math.max(0, totalDays - daysElapsed);
  
  const dailyBudget = daysRemaining > 0 ? remaining / daysRemaining : 0;
  const dailySpendingRate = daysElapsed > 0 ? spent / daysElapsed : 0;
  const projectedSpending = dailySpendingRate * totalDays;

  return {
    budgetAmount,
    spent,
    remaining,
    percentageUsed,
    isOverBudget,
    daysRemaining,
    dailyBudget,
    projectedSpending,
  };
}

// Calculate monthly spending trends
export function calculateMonthlyTrends(
  transactions: Array<{ amount: number; date: Date; type: TransactionType }>
): Array<{ month: string; income: number; expenses: number; net: number }> {
  const monthlyData = transactions.reduce((acc, transaction) => {
    const month = transaction.date.toISOString().slice(0, 7); // YYYY-MM format
    
    if (!acc[month]) {
      acc[month] = { income: 0, expenses: 0 };
    }
    
    if (transaction.type === 'INCOME') {
      acc[month].income += Number(transaction.amount);
    } else {
      acc[month].expenses += Number(transaction.amount);
    }
    
    return acc;
  }, {} as Record<string, { income: number; expenses: number }>);

  return Object.entries(monthlyData)
    .map(([month, data]) => ({
      month,
      income: data.income,
      expenses: data.expenses,
      net: data.income - data.expenses,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

// Calculate category spending distribution
export function calculateCategoryDistribution(
  transactions: Array<{ amount: number; type: TransactionType; category: { name: string; color?: string } }>
): Array<{ categoryName: string; amount: number; percentage: number; color?: string }> {
  const expenses = transactions.filter(t => t.type === 'EXPENSE');
  const totalExpenses = expenses.reduce((sum, t) => sum + Number(t.amount), 0);
  
  const categoryTotals = expenses.reduce((acc, transaction) => {
    const categoryName = transaction.category.name;
    if (!acc[categoryName]) {
      acc[categoryName] = {
        amount: 0,
        color: transaction.category.color,
      };
    }
    acc[categoryName].amount += Number(transaction.amount);
    return acc;
  }, {} as Record<string, { amount: number; color?: string }>);

  return Object.entries(categoryTotals)
    .map(([categoryName, data]) => ({
      categoryName,
      amount: data.amount,
      percentage: totalExpenses > 0 ? (data.amount / totalExpenses) * 100 : 0,
      color: data.color,
    }))
    .sort((a, b) => b.amount - a.amount);
}

// Calculate savings rate
export function calculateSavingsRate(income: number, expenses: number): number {
  if (income <= 0) return 0;
  return ((income - expenses) / income) * 100;
}

// Calculate compound interest
export function calculateCompoundInterest(
  principal: number,
  rate: number,
  time: number,
  compoundingFrequency: number = 12
): number {
  return principal * Math.pow(1 + rate / compoundingFrequency, compoundingFrequency * time);
}

// Calculate emergency fund recommendation
export function calculateEmergencyFundTarget(monthlyExpenses: number, months: number = 6): number {
  return monthlyExpenses * months;
}

// Calculate debt-to-income ratio
export function calculateDebtToIncomeRatio(monthlyDebtPayments: number, monthlyIncome: number): number {
  if (monthlyIncome <= 0) return 0;
  return (monthlyDebtPayments / monthlyIncome) * 100;
}

// Format large numbers with K, M, B suffixes
export function formatLargeNumber(num: number): string {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  } else {
    return num.toFixed(0);
  }
}
