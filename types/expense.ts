export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  createdAt: string;
}

export interface ExpenseFormData {
  amount: number;
  description: string;
  category: string;
  date: string;
}

export type ExpenseCategory = 
  | 'Food & Dining'
  | 'Transportation'
  | 'Shopping'
  | 'Entertainment'
  | 'Bills & Utilities'
  | 'Healthcare'
  | 'Travel'
  | 'Education'
  | 'Other';

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Travel',
  'Education',
  'Other'
];
