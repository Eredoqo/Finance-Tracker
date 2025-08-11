'use client';

import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

import { DashboardData } from '@/dto/dashboard.dto';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import Layout from '@/components/ui/Layout';
import StatCards from '@/components/StatCards';
import RecentTransactions from '@/components/RecentTransactions';
import ActiveBudgets from '@/components/ActiveBudgets';


export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/dashboard?userId=user-1');
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Layout title="Dashboard">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (error || !dashboardData) {
    return (
      <Layout title="Dashboard">
        <Box sx={{ p: 3 }}>
          <Alert severity="error">
            {error || 'Failed to load dashboard data'}
          </Alert>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard">
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Financial Overview - {dashboardData.monthlyTrend.month}
        </Typography>
        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: { 
              xs: '1fr', 
              sm: 'repeat(2, 1fr)', 
              md: 'repeat(4, 1fr)' 
            }, 
            gap: 3, 
            mb: 4 
          }}
        >
          <StatCards summary={dashboardData.summary} formatCurrency={formatCurrency} />
        </Box>
        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: { 
              xs: '1fr', 
              md: '2fr 1fr' 
            }, 
            gap: 3 
          }}
        >
          <RecentTransactions
            transactions={dashboardData.recentTransactions}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
          />
          <ActiveBudgets
            budgets={dashboardData.budgetProgress}
            formatCurrency={formatCurrency}
          />
        </Box>
      </Box>
    </Layout>
  );
}
