import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'user-1'; // Default to first user for demo
    
    // Get current month's start and end dates
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Get transactions for current month
    const monthlyTransactions = await prisma.transaction.findMany({
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
    });

    // Calculate monthly income and expenses
    const monthlyIncome = monthlyTransactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

    const monthlyExpenses = monthlyTransactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

    // Get expense breakdown by category
    const expensesByCategory = monthlyTransactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((acc, transaction) => {
        const categoryName = transaction.category.name;
        const amount = parseFloat(transaction.amount.toString());
        
        if (!acc[categoryName]) {
          acc[categoryName] = {
            name: categoryName,
            amount: 0,
            color: transaction.category.color || '#8884d8',
            icon: transaction.category.icon || '📊',
          };
        }
        acc[categoryName].amount += amount;
        return acc;
      }, {} as Record<string, { name: string; amount: number; color: string; icon: string }>);

    // Get recent transactions (last 10)
    const recentTransactions = await prisma.transaction.findMany({
      where: {
        userId,
      },
      include: {
        category: true,
      },
      orderBy: {
        date: 'desc',
      },
      take: 10,
    });

    // Get active budgets
    const activeBudgets = await prisma.budget.findMany({
      where: {
        userId,
        startDate: {
          lte: now,
        },
        endDate: {
          gte: now,
        },
      },
      include: {
        category: true,
      },
    });

    // Calculate budget progress
    const budgetProgress = activeBudgets.map(budget => {
      const spent = parseFloat(budget.spent.toString());
      const total = parseFloat(budget.amount.toString());
      const remaining = total - spent;
      const percentageUsed = (spent / total) * 100;

      return {
        id: budget.id,
        name: budget.name,
        category: budget.category?.name || 'General',
        spent,
        total,
        remaining,
        percentageUsed,
        color: budget.category?.color || '#8884d8',
        period: budget.period,
      };
    });

    // Get total counts
    const totalTransactions = await prisma.transaction.count({
      where: { userId },
    });

    const totalCategories = await prisma.category.count({
      where: { userId },
    });

    const totalBudgets = await prisma.budget.count({
      where: { userId },
    });

    const dashboardData = {
      summary: {
        monthlyIncome,
        monthlyExpenses,
        netIncome: monthlyIncome - monthlyExpenses,
        totalTransactions,
        totalCategories,
        totalBudgets,
      },
      expensesByCategory: Object.values(expensesByCategory),
      recentTransactions: recentTransactions.map(transaction => ({
        id: transaction.id,
        amount: parseFloat(transaction.amount.toString()),
        description: transaction.description,
        category: transaction.category.name,
        date: transaction.date.toISOString(),
        type: transaction.type,
        merchant: transaction.merchant,
      })),
      budgetProgress,
      monthlyTrend: {
        income: monthlyIncome,
        expenses: monthlyExpenses,
        month: now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      },
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
