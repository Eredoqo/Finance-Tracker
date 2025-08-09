import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface TransactionWithCategory {
  id: string;
  amount: { toString(): string }; // Prisma Decimal type
  description: string;
  date: Date;
  merchant: string | null;
  category: {
    name: string;
    color: string | null;
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'user-1';

    // For now, we'll identify recurring bills as transactions that appear monthly
    // In a real app, you'd have a separate recurring_bills table
    
    // Get all transactions for the user
    const allTransactions = await prisma.transaction.findMany({
      where: {
        userId,
        type: 'EXPENSE',
      },
      include: {
        category: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    // Group transactions by description and find recurring patterns
    const transactionGroups: { [key: string]: TransactionWithCategory[] } = {};
    
    allTransactions.forEach(transaction => {
      const key = `${transaction.description.toLowerCase()}-${transaction.amount}`;
      if (!transactionGroups[key]) {
        transactionGroups[key] = [];
      }
      transactionGroups[key].push(transaction as TransactionWithCategory);
    });

    // Identify recurring bills (transactions that appear 3+ times)
    const recurringBills = Object.entries(transactionGroups)
      .filter(([, transactions]) => transactions.length >= 3)
      .map(([, transactions]) => {
        const sortedTransactions = transactions.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        
        const latestTransaction = sortedTransactions[0];
        const frequency = calculateFrequency(sortedTransactions);
        const nextDueDate = calculateNextDueDate(latestTransaction.date, frequency);
        
        return {
          id: `recurring-${latestTransaction.id}`,
          name: latestTransaction.description,
          amount: parseFloat(latestTransaction.amount.toString()),
          category: latestTransaction.category.name,
          categoryColor: latestTransaction.category.color,
          frequency,
          nextDueDate: nextDueDate.toISOString(),
          lastPaidDate: latestTransaction.date.toISOString(),
          merchant: latestTransaction.merchant,
          status: getStatus(nextDueDate),
          occurrences: transactions.length,
          averageAmount: transactions.reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0) / transactions.length,
        };
      })
      .sort((a, b) => new Date(a.nextDueDate).getTime() - new Date(b.nextDueDate).getTime());

    return NextResponse.json(recurringBills);
  } catch (error) {
    console.error('Error fetching recurring bills:', error);
    return NextResponse.json({ error: 'Failed to fetch recurring bills' }, { status: 500 });
  }
}

function calculateFrequency(transactions: TransactionWithCategory[]): string {
  if (transactions.length < 2) return 'Unknown';
  
  const dates = transactions.map(t => new Date(t.date)).sort((a, b) => a.getTime() - b.getTime());
  const intervals = [];
  
  for (let i = 1; i < dates.length; i++) {
    const days = Math.round((dates[i].getTime() - dates[i-1].getTime()) / (1000 * 60 * 60 * 24));
    intervals.push(days);
  }
  
  const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
  
  if (avgInterval <= 10) return 'Weekly';
  if (avgInterval <= 35) return 'Monthly';
  if (avgInterval <= 100) return 'Quarterly';
  if (avgInterval <= 400) return 'Yearly';
  return 'Irregular';
}

function calculateNextDueDate(lastDate: Date, frequency: string): Date {
  const date = new Date(lastDate);
  
  switch (frequency) {
    case 'Weekly':
      date.setDate(date.getDate() + 7);
      break;
    case 'Monthly':
      date.setMonth(date.getMonth() + 1);
      break;
    case 'Quarterly':
      date.setMonth(date.getMonth() + 3);
      break;
    case 'Yearly':
      date.setFullYear(date.getFullYear() + 1);
      break;
    default:
      date.setMonth(date.getMonth() + 1); // Default to monthly
  }
  
  return date;
}

function getStatus(dueDate: Date): string {
  const now = new Date();
  const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'Overdue';
  if (diffDays <= 3) return 'Due Soon';
  if (diffDays <= 7) return 'Upcoming';
  return 'Scheduled';
}
