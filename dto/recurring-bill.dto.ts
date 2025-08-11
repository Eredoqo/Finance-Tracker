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
