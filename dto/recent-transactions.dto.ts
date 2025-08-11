export interface RecentTransaction {
  id: string;
  description: string;
  category: string;
  date: string;
  merchant?: string;
  type: string;
  amount: number;
}

export interface RecentTransactionsProps {
  transactions: RecentTransaction[];
  formatCurrency: (amount: number) => string;
  formatDate: (date: string) => string;
}
