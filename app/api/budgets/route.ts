import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { BudgetPeriod } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'user-1'; 
    const period = searchParams.get('period') as BudgetPeriod | null;

    const where: {
      userId: string;
      period?: BudgetPeriod;
    } = { userId };

    if (period && ['WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY'].includes(period)) {
      where.period = period;
    }

    const budgets = await prisma.budget.findMany({
      where,
      include: {
        category: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        startDate: 'desc',
      },
    });

    const transformedBudgets = budgets.map(budget => ({
      id: budget.id,
      name: budget.name,
      amount: parseFloat(budget.amount.toString()),
      spent: parseFloat(budget.spent.toString()),
      period: budget.period,
      startDate: budget.startDate.toISOString(),
      endDate: budget.endDate.toISOString(),
      category: budget.category ? {
        id: budget.category.id,
        name: budget.category.name,
        color: budget.category.color,
        icon: budget.category.icon,
      } : null,
      userId: budget.userId,
      categoryId: budget.categoryId,
      createdAt: budget.createdAt.toISOString(),
      updatedAt: budget.updatedAt.toISOString(),
      remaining: parseFloat(budget.amount.toString()) - parseFloat(budget.spent.toString()),
      percentageUsed: (parseFloat(budget.spent.toString()) / parseFloat(budget.amount.toString())) * 100,
    }));

    return NextResponse.json(transformedBudgets);
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return NextResponse.json({ error: 'Failed to fetch budgets' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      name, 
      amount, 
      period,
      startDate,
      endDate,
      categoryId,
      userId = 'user-1'
    } = body;

    const budget = await prisma.budget.create({
      data: {
        name,
        amount: parseFloat(amount),
        period,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        categoryId,
        userId,
        spent: 0, 
      },
      include: {
        category: true,
      },
    });

    const transformedBudget = {
      id: budget.id,
      name: budget.name,
      amount: parseFloat(budget.amount.toString()),
      spent: parseFloat(budget.spent.toString()),
      period: budget.period,
      startDate: budget.startDate.toISOString(),
      endDate: budget.endDate.toISOString(),
      category: budget.category ? {
        id: budget.category.id,
        name: budget.category.name,
        color: budget.category.color,
        icon: budget.category.icon,
      } : null,
      userId: budget.userId,
      categoryId: budget.categoryId,
      createdAt: budget.createdAt.toISOString(),
      updatedAt: budget.updatedAt.toISOString(),
      remaining: parseFloat(budget.amount.toString()),
      percentageUsed: 0,
    };

    return NextResponse.json(transformedBudget);
  } catch (error) {
    console.error('Error creating budget:', error);
    return NextResponse.json({ error: 'Failed to create budget' }, { status: 500 });
  }
}
