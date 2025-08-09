import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Expense } from '@/types/expense';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { expenses }: { expenses: Expense[] } = await request.json();

    if (!expenses || expenses.length === 0) {
      return NextResponse.json({ 
        error: 'No expenses provided' 
      }, { status: 400 });
    }

    // Prepare expense data for AI analysis
    const expenseData = expenses.map((expense: Expense) => ({
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
      date: expense.date
    }));

    const totalAmount = expenses.reduce((sum: number, expense: Expense) => sum + expense.amount, 0);
    const categorySummary = expenses.reduce((acc: Record<string, number>, expense: Expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    const prompt = `
    Analyze these personal expenses and provide helpful financial insights:
    
    Total Expenses: $${totalAmount.toFixed(2)}
    Number of Transactions: ${expenses.length}
    
    Category Breakdown:
    ${Object.entries(categorySummary).map(([category, amount]) => 
      `- ${category}: $${(amount as number).toFixed(2)}`
    ).join('\n')}
    
    Recent Transactions:
    ${expenseData.slice(0, 10).map((expense) => 
      `- ${expense.description}: $${expense.amount} (${expense.category})`
    ).join('\n')}
    
    Please provide:
    1. A brief analysis of spending patterns
    2. Suggestions for potential savings
    3. Any concerning trends you notice
    4. One actionable tip for better financial management
    
    Keep the response concise and helpful (under 200 words).
    `;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a helpful financial advisor AI that provides personalized insights based on expense data. Be encouraging and practical in your advice.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'gpt-3.5-turbo',
      max_tokens: 300,
      temperature: 0.7,
    });

    const insight = completion.choices[0]?.message?.content || 'Unable to generate insights at this time.';

    return NextResponse.json({ insight });

  } catch (error) {
    console.error('Error generating AI insights:', error);
    return NextResponse.json({ 
      error: 'Failed to generate insights. Please check your OpenAI API key.' 
    }, { status: 500 });
  }
}
