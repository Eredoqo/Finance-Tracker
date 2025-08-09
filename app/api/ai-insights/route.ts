import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Expense } from '@/types/expense';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // If chat messages are provided, use them for chat
    if (body.messages && Array.isArray(body.messages)) {
      try {
        // Use the correct model name
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const prompt = body.messages
          .map((msg: { role: string; content: string }) => 
            `${msg.role === 'user' ? 'User' : 'AI'}: ${msg.content}`
          )
          .join('\n');
        
        const result = await model.generateContent(prompt);
        const aiResponse = result.response.text();
        return NextResponse.json({ insight: aiResponse });
      } catch (err) {
        console.error('Gemini chat error:', err);
        return NextResponse.json({ 
          error: 'Failed to generate chat response. Please check your Gemini API key.' 
        }, { status: 500 });
      }
    }

    const { expenses, budgets = [], categories = [] }: { 
      expenses?: Expense[], 
      budgets?: unknown[], 
      categories?: unknown[] 
    } = body;
    
    if (!expenses || expenses.length === 0) {
      return NextResponse.json({ error: 'No expenses provided' }, { status: 400 });
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
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
        Average Transaction Amount: $${(totalAmount / expenses.length).toFixed(2)}
        
        Category Breakdown:
        ${Object.entries(categorySummary)
          .map(([category, amount]) => `- ${category}: $${(amount as number).toFixed(2)}`)
          .join('\n')}
        
        Recent Transactions:
        ${expenseData.slice(0, 10)
          .map((expense) => `- ${expense.description}: $${expense.amount} (${expense.category})`)
          .join('\n')}
        
        Please provide:
        1. A brief analysis of spending patterns
        2. Suggestions for potential savings
        3. Any concerning trends you notice
        4. One actionable tip for better financial management
        
        Keep the response concise and helpful (under 200 words).
      `;

      const result = await model.generateContent(prompt);
      const aiResponse = result.response.text();
      return NextResponse.json({ insight: aiResponse });
      
    } catch (err) {
      console.error('Gemini insights error:', err);
      return NextResponse.json({ 
        error: 'Failed to generate financial insights. Please check your Gemini API key.' 
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Error generating AI insights:', error);
    return NextResponse.json({ 
      error: 'Failed to generate insights. Please check your request format.' 
    }, { status: 500 });
  }
}