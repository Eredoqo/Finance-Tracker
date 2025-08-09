"use client";
import { useEffect, useState } from "react";
import ExpenseReports from "../../components/tables/ExpenseReports";
import Layout from '@/components/ui/Layout';
import { Box } from "@mui/system";
import { Typography } from "@mui/material";


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

  useEffect(() => {
    async function fetchExpenses() {
      setLoading(true);
      try {
        const res = await fetch("/api/transactions");
        const data = await res.json();
        setExpenses(data.transactions || []);
      } catch {
        setExpenses([]);
      } finally {
        setLoading(false);
      }
    }
    fetchExpenses();
  }, []);

  const handleAddExpense = () => {
    // Redirect to add expense form or open modal (to be implemented)
    alert("Add Expense functionality coming soon!");
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
    </Box>
    </Layout>
  );
}
