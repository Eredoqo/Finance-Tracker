import { prisma } from '@/lib/prisma';
import type { 
  TransactionWithCategory, 
  BudgetWithCategory, 
  CategoryWithTransactions,
  TransactionFilters,
  BudgetFilters 
} from '@/types';

// Transaction API functions
export async function getTransactions(
  userId: string,
  filters?: TransactionFilters,
  page: number = 1,
  pageSize: number = 10
) {
  const where: Record<string, unknown> = { userId };

  if (filters) {
    if (filters.startDate || filters.endDate) {
      const dateFilter: Record<string, Date> = {};
      if (filters.startDate) {
        dateFilter.gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        dateFilter.lte = new Date(filters.endDate);
      }
      where.date = dateFilter;
    }
    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }
    if (filters.type) {
      where.type = filters.type;
    }
    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.minAmount !== undefined || filters.maxAmount !== undefined) {
      const amountFilter: Record<string, number> = {};
      if (filters.minAmount !== undefined) {
        amountFilter.gte = filters.minAmount;
      }
      if (filters.maxAmount !== undefined) {
        amountFilter.lte = filters.maxAmount;
      }
      where.amount = amountFilter;
    }
    if (filters.search) {
      where.OR = [
        { description: { contains: filters.search, mode: 'insensitive' } },
        { merchant: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
  }

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: { date: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.transaction.count({ where }),
  ]);

  return {
    data: transactions as TransactionWithCategory[],
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}

export async function createTransaction(
  userId: string,
  data: {
    amount: number;
    description: string;
    date: Date;
    type: 'INCOME' | 'EXPENSE';
    categoryId: string;
    merchant?: string;
    notes?: string;
  }
) {
  return prisma.transaction.create({
    data: {
      ...data,
      userId,
    },
    include: {
      category: true,
    },
  }) as Promise<TransactionWithCategory>;
}

export async function updateTransaction(
  id: string,
  userId: string,
  data: Partial<{
    amount: number;
    description: string;
    date: Date;
    type: 'INCOME' | 'EXPENSE';
    categoryId: string;
    merchant: string;
    notes: string;
    status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'PROCESSING' | 'REIMBURSED';
  }>
) {
  return prisma.transaction.update({
    where: { id, userId },
    data,
    include: {
      category: true,
    },
  }) as Promise<TransactionWithCategory>;
}

export async function deleteTransaction(id: string, userId: string) {
  return prisma.transaction.delete({
    where: { id, userId },
  });
}

// Category API functions
export async function getCategories(userId: string) {
  return prisma.category.findMany({
    where: { userId },
    include: {
      _count: {
        select: { transactions: true },
      },
    },
    orderBy: { name: 'asc' },
  }) as Promise<CategoryWithTransactions[]>;
}

export async function createCategory(
  userId: string,
  data: {
    name: string;
    description?: string;
    color?: string;
    icon?: string;
  }
) {
  return prisma.category.create({
    data: {
      ...data,
      userId,
    },
  });
}

export async function updateCategory(
  id: string,
  userId: string,
  data: Partial<{
    name: string;
    description: string;
    color: string;
    icon: string;
  }>
) {
  return prisma.category.update({
    where: { id, userId },
    data,
  });
}

export async function deleteCategory(id: string, userId: string) {
  // Check if category has transactions
  const transactionCount = await prisma.transaction.count({
    where: { categoryId: id, userId },
  });

  if (transactionCount > 0) {
    throw new Error('Cannot delete category with existing transactions');
  }

  return prisma.category.delete({
    where: { id, userId },
  });
}

// Budget API functions
export async function getBudgets(
  userId: string,
  filters?: BudgetFilters,
  page: number = 1,
  pageSize: number = 10
) {
  const where: Record<string, unknown> = { userId };

  if (filters) {
    if (filters.period) {
      where.period = filters.period;
    }
    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }
    if (filters.active !== undefined) {
      const now = new Date();
      if (filters.active) {
        where.startDate = { lte: now };
        where.endDate = { gte: now };
      } else {
        where.OR = [
          { startDate: { gt: now } },
          { endDate: { lt: now } },
        ];
      }
    }
  }

  const [budgets, total] = await Promise.all([
    prisma.budget.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: { startDate: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.budget.count({ where }),
  ]);

  return {
    data: budgets as BudgetWithCategory[],
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}

export async function createBudget(
  userId: string,
  data: {
    name: string;
    amount: number;
    period: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
    startDate: Date;
    endDate: Date;
    categoryId?: string;
  }
) {
  return prisma.budget.create({
    data: {
      ...data,
      userId,
    },
    include: {
      category: true,
    },
  }) as Promise<BudgetWithCategory>;
}

export async function updateBudget(
  id: string,
  userId: string,
  data: Partial<{
    name: string;
    amount: number;
    period: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
    startDate: Date;
    endDate: Date;
    categoryId: string;
  }>
) {
  return prisma.budget.update({
    where: { id, userId },
    data,
    include: {
      category: true,
    },
  }) as Promise<BudgetWithCategory>;
}

export async function deleteBudget(id: string, userId: string) {
  return prisma.budget.delete({
    where: { id, userId },
  });
}

// Dashboard data
export async function getDashboardData(userId: string) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const [
    monthlyTransactions,
    totalTransactions,
    activeBudgets,
    categories,
  ] = await Promise.all([
    prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      include: {
        category: true,
      },
    }),
    prisma.transaction.count({
      where: { userId },
    }),
    prisma.budget.findMany({
      where: {
        userId,
        startDate: { lte: now },
        endDate: { gte: now },
      },
      include: {
        category: true,
      },
    }),
    prisma.category.findMany({
      where: { userId },
    }),
  ]);

  return {
    monthlyTransactions,
    totalTransactions,
    activeBudgets,
    categories,
  };
}
