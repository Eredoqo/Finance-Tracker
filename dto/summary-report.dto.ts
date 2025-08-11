export interface SummaryData {
  income: number;
  expenses: number;
  netIncome: number;
  transactionCount: number;
  avgTransactionAmount: number;
  savingsRate: number;
}

export interface SummaryReportProps {
  summaryData: SummaryData;
  timeRange: string;
  formatCurrency: (amount: number) => string;
}
