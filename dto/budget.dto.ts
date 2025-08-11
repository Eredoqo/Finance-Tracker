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
  status?: 'Over Budget' | 'Near Limit' | 'On Track' | string;
}
