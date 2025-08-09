import { Transaction, Category, Budget, User, TransactionType, TransactionStatus, BudgetPeriod } from '@prisma/client';

// Re-export Prisma types
export type {
  Transaction,
  Category,
  Budget,
  User,
  TransactionType,
  TransactionStatus,
  BudgetPeriod,
};

// Extended types with relations
export type TransactionWithCategory = Transaction & {
  category: Category;
};

export type BudgetWithCategory = Budget & {
  category?: Category | null;
};

export type CategoryWithTransactions = Category & {
  transactions?: Transaction[];
  _count?: {
    transactions: number;
  };
};

// Form types
export interface TransactionFormData {
  amount: number;
  description: string;
  date: string;
  type: TransactionType;
  categoryId: string;
  merchant?: string;
  notes?: string;
}

export interface CategoryFormData {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
}

export interface BudgetFormData {
  name: string;
  amount: number;
  period: BudgetPeriod;
  startDate: string;
  endDate: string;
  categoryId?: string;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// Dashboard types
export interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  transactionCount: number;
  budgetUtilization: number;
}

export interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  net: number;
}

export interface CategorySpending {
  categoryId: string;
  categoryName: string;
  amount: number;
  percentage: number;
  color?: string;
}

// Filter types
export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  type?: TransactionType;
  status?: TransactionStatus;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
}

export interface BudgetFilters {
  period?: BudgetPeriod;
  categoryId?: string;
  active?: boolean;
}

// Chart data types
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface TimeSeriesData {
  date: string;
  value: number;
  category?: string;
}

// Navigation types
export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType;
  badge?: number;
}

// Settings types
export interface UserSettings {
  currency: string;
  locale: string;
  dateFormat: string;
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    budgetAlerts: boolean;
    weeklyReports: boolean;
  };
}
