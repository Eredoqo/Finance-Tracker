import { CategorySummary } from './category-summary.dto';

export interface CategoryReportProps {
  categoryBreakdown: CategorySummary[];
  formatCurrency: (amount: number) => string;
}
