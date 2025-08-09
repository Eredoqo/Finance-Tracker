'use client';

import { Expense } from '@/types/expense';
import { Trash2, Calendar, Tag, DollarSign } from 'lucide-react';

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
}

export default function ExpenseList({ expenses, onDeleteExpense }: ExpenseListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-gray-400 mb-4">
          <DollarSign size={48} className="mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-600 mb-2">No expenses yet</h3>
        <p className="text-gray-500">Start tracking your expenses by adding your first expense above.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Recent Expenses</h2>
      </div>
      
      <div className="divide-y divide-gray-200">
        {expenses.map((expense) => (
          <div key={expense.id} className="p-4 hover:bg-gray-50 transition-colors duration-150">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{expense.description}</h3>
                  <span className="text-lg font-bold text-red-600">
                    {formatCurrency(expense.amount)}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Tag size={14} className="mr-1" />
                    <span>{expense.category}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-1" />
                    <span>{formatDate(expense.date)}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => onDeleteExpense(expense.id)}
                className="ml-4 p-2 text-gray-400 hover:text-red-600 transition-colors duration-150"
                title="Delete expense"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
