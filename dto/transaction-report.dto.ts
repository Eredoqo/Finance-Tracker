import { Transaction } from './transaction.dto';

export interface TransactionReportProps {
  filteredTransactions: Transaction[];
  formatCurrency: (amount: number) => string;
}
