"use client";
import { useEffect, useState } from "react";
import ExpenseReports from "../../components/expenses/ExpenseReports";
import Layout from '@/components/ui/Layout';
import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import ExpenseForm from '@/components/forms/ExpenseForm';


type Expense = {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
};

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);

  useEffect(() => {
    async function fetchExpenses() {
      setLoading(true);
      try {
        const res = await fetch("/api/transactions");
        const data = await res.json();
        setExpenses(Array.isArray(data) ? data : []);
      } catch {
        setExpenses([]);
      } finally {
        setLoading(false);
      }
    }
    fetchExpenses();
  }, []);

  const handleAddExpense = () => {
    setOpenForm(true);
  };

  const handleFormClose = () => {
    setOpenForm(false);
  };

  const handleFormSubmit = async (expense: { amount: number; description: string; category: string; date: string }) => {
    // You may want to POST to your API here
    setExpenses(prev => [
      { id: Math.random().toString(), ...expense },
      ...prev
    ]);
    setOpenForm(false);
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await fetch(`/api/transactions?id=${id}`, { method: "DELETE" });
      setExpenses((prev) => prev.filter((exp) => exp.id !== id));
    } catch {
      alert("Failed to delete expense.");
    }
  };

  return (
    <Layout title="Transactions">
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Expenses ({expenses.length})
        </Typography>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ExpenseReports
            expenses={expenses}
            onAddExpense={handleAddExpense}
            onDeleteExpense={handleDeleteExpense}
          />
        )}
        <ExpenseForm
          open={openForm}
          onClose={handleFormClose}
          onAddExpense={handleFormSubmit}
        />
      </Box>
    </Layout>
  );
}
