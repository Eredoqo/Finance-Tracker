import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TransactionType} from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'user-1'; // Default to first user for demo
    const limit = parseInt(searchParams.get('limit') || '50');
    const type = searchParams.get('type') as TransactionType | null;
    const categoryId = searchParams.get('categoryId');

    const where: {
      userId: string;
      type?: TransactionType;
      categoryId?: string;
    } = { userId };
    
    if (type && (type === 'INCOME' || type === 'EXPENSE')) {
      where.type = type;
    }
    
    if (categoryId) {
      where.categoryId = categoryId;
    }

    const transactions = await prisma.transaction.findMany({
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
        date: 'desc',
      },
      take: limit,
    });

    // Transform to match your existing Expense interface
    const transformedTransactions = transactions.map(transaction => ({
      id: transaction.id,
      amount: parseFloat(transaction.amount.toString()),
      description: transaction.description,
      category: transaction.category.name,
      date: transaction.date.toISOString(),
      createdAt: transaction.createdAt.toISOString(),
      type: transaction.type,
      status: transaction.status,
      merchant: transaction.merchant,
      notes: transaction.notes,
      categoryId: transaction.categoryId,
      userId: transaction.userId,
    }));

    return NextResponse.json(transformedTransactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      amount, 
      description, 
      categoryId, 
      date, 
      type = 'EXPENSE' as TransactionType,
      status = 'APPROVED',
      merchant,
      notes,
      userId = 'user-1' // Default to first user for demo
    } = body;

    const transaction = await prisma.transaction.create({
      data: {
        amount: parseFloat(amount),
        description,
        categoryId,
        date: new Date(date),
        type,
        status,
        merchant,
        notes,
        userId,
      },
      include: {
        category: true,
      },
    });

    const transformedTransaction = {
      id: transaction.id,
      amount: parseFloat(transaction.amount.toString()),
      description: transaction.description,
      category: transaction.category.name,
      date: transaction.date.toISOString(),
      createdAt: transaction.createdAt.toISOString(),
      type: transaction.type,
      status: transaction.status,
      merchant: transaction.merchant,
      notes: transaction.notes,
      categoryId: transaction.categoryId,
      userId: transaction.userId,
    };

    return NextResponse.json(transformedTransaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}
