
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { NotificationService } from '@/lib/notifications'

const prisma = new PrismaClient()

interface JwtPayload {
  userId: string;
}
function getUserFromToken(request: NextRequest) {
    
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return null
    
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
    return decoded.userId
  } catch {
    return null
  }
}

// GET - Fetch user income records
export async function GET(request: NextRequest) {
  const userId = getUserFromToken(request)
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const page = parseInt(searchParams.get('page') || '1')
    const skip = (page - 1) * limit

    const income = await prisma.income.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    const total = await prisma.income.count({
      where: { userId }
    })

    const totalAmount = await prisma.income.aggregate({
      where: { userId },
      _sum: { amount: true }
    })

    return NextResponse.json({
      income,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      summary: {
        totalAmount: totalAmount._sum.amount || 0,
        count: total
      }
    })
  } catch (error) {
    console.error('Error fetching income:', error)
    return NextResponse.json({ error: 'Failed to fetch income' }, { status: 500 })
  }
}

// POST - Create new income record
export async function POST(request: NextRequest) {
  const userId = getUserFromToken(request)
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { amount, description, source, date } = await request.json()

    // Validate required fields
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Valid amount is required' }, { status: 400 })
    }

    const income = await prisma.income.create({
      data: {
        userId,
        amount: parseFloat(amount),
        description: description || 'Income',
        source: source || 'Unknown',
        date: date ? new Date(date) : new Date()
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    // Create notification for income added
    await NotificationService.createNotification(
      userId,
      'Income Added',
      `New income of $${amount} has been recorded`,
      'INCOME_ADDED',
      {
        incomeId: income.id,
        amount: parseFloat(amount),
        source: source || 'Unknown'
      }
    )

    return NextResponse.json({ income }, { status: 201 })
  } catch (error) {
    console.error('Error creating income:', error)
    return NextResponse.json({ error: 'Failed to create income' }, { status: 500 })
  }
}

// PUT - Update income record
export async function PUT(request: NextRequest) {
  const userId = getUserFromToken(request)
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id, amount, description, source, date } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Income ID is required' }, { status: 400 })
    }

    // Check if income belongs to user
    const existingIncome = await prisma.income.findFirst({
      where: { id, userId }
    })

    if (!existingIncome) {
      return NextResponse.json({ error: 'Income not found' }, { status: 404 })
    }

    const updatedIncome = await prisma.income.update({
      where: { id },
      data: {
        ...(amount && { amount: parseFloat(amount) }),
        ...(description && { description }),
        ...(source && { source }),
        ...(date && { date: new Date(date) })
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    return NextResponse.json({ income: updatedIncome })
  } catch (error) {
    console.error('Error updating income:', error)
    return NextResponse.json({ error: 'Failed to update income' }, { status: 500 })
  }
}

// DELETE - Delete income record
export async function DELETE(request: NextRequest) {
  const userId = getUserFromToken(request)
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Income ID is required' }, { status: 400 })
    }

    // Check if income belongs to user
    const existingIncome = await prisma.income.findFirst({
      where: { id, userId }
    })

    if (!existingIncome) {
      return NextResponse.json({ error: 'Income not found' }, { status: 404 })
    }

    await prisma.income.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Income deleted successfully' })
  } catch (error) {
    console.error('Error deleting income:', error)
    return NextResponse.json({ error: 'Failed to delete income' }, { status: 500 })
  }
}