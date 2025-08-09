'use client';

import { Expense } from '@/types/expense';
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';

interface ExpenseSummaryProps {
  expenses: Expense[];
}

export default function ExpenseSummary({ expenses }: ExpenseSummaryProps) {
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const thisMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
  });
  
  const lastMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    return expenseDate.getMonth() === lastMonth && expenseDate.getFullYear() === lastMonthYear;
  });

  const thisMonthTotal = thisMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const lastMonthTotal = lastMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const monthlyChange = lastMonthTotal > 0 ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100 : 0;
  const averageExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (percentage: number) => {
    return `${percentage > 0 ? '+' : ''}${percentage.toFixed(1)}%`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Expenses</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalExpenses)}</p>
          </div>
          <div className="p-3 bg-blue-100 rounded-full">
            <DollarSign className="text-blue-600" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">This Month</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(thisMonthTotal)}</p>
          </div>
          <div className="p-3 bg-green-100 rounded-full">
            <Calendar className="text-green-600" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Monthly Change</p>
            <p className={`text-2xl font-bold ${monthlyChange >= 0 ? 'text-red-600' : 'text-green-600'}`}>
              {formatPercentage(monthlyChange)}
            </p>
          </div>
          <div className={`p-3 rounded-full ${monthlyChange >= 0 ? 'bg-red-100' : 'bg-green-100'}`}>
            {monthlyChange >= 0 ? (
              <TrendingUp className="text-red-600" size={24} />
            ) : (
              <TrendingDown className="text-green-600" size={24} />
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Average Expense</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(averageExpense)}</p>
          </div>
          <div className="p-3 bg-purple-100 rounded-full">
            <TrendingUp className="text-purple-600" size={24} />
          </div>
        </div>
      </div>
    </div>
  );
}
