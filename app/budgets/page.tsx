'use client';

import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

import Layout from '@/components/ui/Layout';
import BudgetsHeader from '@/components/budgets/BudgetsHeader';
import NoBudgets from '@/components/budgets/NoBudgets';
import BudgetCards from '@/components/budgets/BudgetCards';
import { Budget } from '@/dto/budget.dto';


export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/budgets?userId=user-1');
      if (!response.ok) {
        throw new Error('Failed to fetch budgets');
      }
      const data = await response.json();
      setBudgets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  if (loading) {
    return (
      <Layout title="Budgets">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout title="Budgets">
      <Box sx={{ p: 3 }}>
        <BudgetsHeader onRefresh={fetchBudgets} />

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {budgets.length > 0 ? (
          <BudgetCards budgets={budgets} />
        ) : (
          <NoBudgets />
        )}
      </Box>
    </Layout>
  );
}
