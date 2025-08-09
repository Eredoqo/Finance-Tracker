'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/ui/Layout';
import ExpenseReports from '@/components/tables/ExpenseReports';
import MUIExpenseForm from '@/components/forms/MUIExpenseForm';

// Mock data for now - will be replaced with real API calls
interface MockTransaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  createdAt: string;
}

interface TransactionFormData {
  amount: number;
  description: string;
  category: string;
  date: string;
}

export default function Home() {
  const [expenses, setExpenses] = useState<MockTransaction[]>([]);
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  // Load expenses from localStorage on component mount
  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses');
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
  }, []);

  // Save expenses to localStorage whenever expenses change
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = (expenseData: TransactionFormData) => {
    const newExpense: MockTransaction = {
      id: Date.now().toString(),
      ...expenseData,
      createdAt: new Date().toISOString(),
    };
    setExpenses(prev => [newExpense, ...prev]);
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const handleAddExpense = () => {
    setShowExpenseForm(true);
  };

  const handleCloseExpenseForm = () => {
    setShowExpenseForm(false);
  };

  return (
    <Layout title="Expense Reports">
      <ExpenseReports 
        expenses={expenses}
        onAddExpense={handleAddExpense}
        onDeleteExpense={deleteExpense}
      />
      
      <MUIExpenseForm
        open={showExpenseForm}
        onClose={handleCloseExpenseForm}
        onAddExpense={addExpense}
      />
    </Layout>
  );
}
