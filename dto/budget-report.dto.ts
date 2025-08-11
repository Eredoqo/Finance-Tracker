import { Budget } from './budget.dto';

export interface BudgetReportProps {
  budgetPerformance: Budget[];
  formatCurrency: (amount: number) => string;
}
