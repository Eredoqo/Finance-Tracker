export interface Income {
  id: string;
  userId: string;
  amount: number;
  description?: string | null;
  source?: string | null;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    name: string | null;
    email: string;
  };
}

export interface CreateIncomeRequest {
  amount: number;
  description?: string;
  source?: string;
  date?: string;
}

export interface UpdateIncomeRequest {
  id: string;
  amount?: number;
  description?: string;
  source?: string;
  date?: string;
}

export interface IncomeResponse {
  income: Income[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  summary: {
    totalAmount: number;
    count: number;
  };
}
