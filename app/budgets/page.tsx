'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Card, 
  CardContent, 
  LinearProgress,
  Chip,
  Button,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add,
  Warning,
  CheckCircle,
  Error as ErrorIcon,
  Refresh,
} from '@mui/icons-material';
import Layout from '@/components/ui/Layout';

interface Budget {
  id: string;
  name: string;
  amount: number;
  spent: number;
  period: string;
  startDate: string;
  endDate: string;
  category: {
    id: string;
    name: string;
    color: string;
    icon: string;
  } | null;
  remaining: number;
  percentageUsed: number;
}

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getProgressColor = (percentage: number): 'error' | 'warning' | 'success' => {
    if (percentage >= 90) return 'error';
    if (percentage >= 75) return 'warning';
    return 'success';
  };

  const getStatusIcon = (percentage: number) => {
    if (percentage >= 100) return <ErrorIcon color="error" />;
    if (percentage >= 90) return <Warning color="warning" />;
    return <CheckCircle color="success" />;
  };

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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Budget Management
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Refresh">
              <IconButton onClick={fetchBudgets}>
                <Refresh />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<Add />}
            >
              Create Budget
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
          {budgets.map((budget) => (
            <Card key={budget.id}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {budget.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {budget.category?.name || 'General'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getStatusIcon(budget.percentageUsed)}
                    <Chip 
                      label={budget.period} 
                      size="small" 
                      variant="outlined"
                    />
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">
                      {formatCurrency(budget.spent)} of {formatCurrency(budget.amount)}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {budget.percentageUsed.toFixed(1)}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(budget.percentageUsed, 100)}
                    color={getProgressColor(budget.percentageUsed)}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Remaining
                    </Typography>
                    <Typography 
                      variant="h6" 
                      color={budget.remaining > 0 ? 'success.main' : 'error.main'}
                      sx={{ fontWeight: 600 }}
                    >
                      {formatCurrency(budget.remaining)}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body2" color="textSecondary">
                      Period
                    </Typography>
                    <Typography variant="body2">
                      {new Date(budget.startDate).toLocaleDateString()} - {new Date(budget.endDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        {budgets.length === 0 && !loading && (
          <Paper sx={{ p: 6, textAlign: 'center' }}>
            <Typography variant="h6" color="textSecondary" sx={{ mb: 2 }}>
              No budgets created yet
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              Create your first budget to start tracking your spending goals
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
            >
              Create Your First Budget
            </Button>
          </Paper>
        )}
      </Box>
    </Layout>
  );
}
