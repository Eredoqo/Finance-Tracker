'use client';

import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

import TrendingUp from '@mui/icons-material/TrendingUp';
import TrendingDown from '@mui/icons-material/TrendingDown';
import AttachMoney from '@mui/icons-material/AttachMoney';
import Receipt from '@mui/icons-material/Receipt';
import CreditCard from '@mui/icons-material/CreditCard';
import Savings from '@mui/icons-material/Savings';
import Layout from '@/components/ui/Layout';

interface DashboardData {
  summary: {
    monthlyIncome: number;
    monthlyExpenses: number;
    netIncome: number;
    totalTransactions: number;
    totalCategories: number;
    totalBudgets: number;
  };
  expensesByCategory: Array<{
    name: string;
    amount: number;
    color: string;
    icon: string;
  }>;
  recentTransactions: Array<{
    id: string;
    amount: number;
    description: string;
    category: string;
    date: string;
    type: string;
    merchant?: string;
  }>;
  budgetProgress: Array<{
    id: string;
    name: string;
    category: string;
    spent: number;
    total: number;
    remaining: number;
    percentageUsed: number;
    color: string;
    period: string;
  }>;
  monthlyTrend: {
    income: number;
    expenses: number;
    month: string;
  };
}

function StatCard({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue 
}: { 
  title: string; 
  value: string; 
  icon: React.ReactNode; 
  trend?: 'up' | 'down'; 
  trendValue?: string;
}) {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              {value}
            </Typography>
            {trend && trendValue && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {trend === 'up' ? (
                  <TrendingUp fontSize="small" color="success" />
                ) : (
                  <TrendingDown fontSize="small" color="error" />
                )}
                <Typography 
                  variant="body2" 
                  color={trend === 'up' ? 'success.main' : 'error.main'}
                >
                  {trendValue}
                </Typography>
              </Box>
            )}
          </Box>
          <Box sx={{ color: 'primary.main' }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

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

        {/* Stats Cards */}
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
          <StatCard
            title="Monthly Income"
            value={formatCurrency(dashboardData.summary.monthlyIncome)}
            icon={<AttachMoney fontSize="large" />}
            trend="up"
            trendValue="+12.5%"
          />
          <StatCard
            title="Monthly Expenses"
            value={formatCurrency(dashboardData.summary.monthlyExpenses)}
            icon={<Receipt fontSize="large" />}
            trend="down"
            trendValue="-8.2%"
          />
          <StatCard
            title="Net Income"
            value={formatCurrency(dashboardData.summary.netIncome)}
            icon={<Savings fontSize="large" />}
            trend={dashboardData.summary.netIncome > 0 ? "up" : "down"}
            trendValue={dashboardData.summary.netIncome > 0 ? "+15.3%" : "-5.2%"}
          />
          <StatCard
            title="Total Transactions"
            value={dashboardData.summary.totalTransactions.toString()}
            icon={<CreditCard fontSize="large" />}
          />
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
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Recent Transactions
            </Typography>
            <List>
              {dashboardData.recentTransactions.slice(0, 5).map((transaction) => (
                <ListItem key={transaction.id} divider>
                  <ListItemIcon>
                    <Receipt />
                  </ListItemIcon>
                  <ListItemText
                    primary={transaction.description}
                    secondary={`${transaction.category} • ${formatDate(transaction.date)}${transaction.merchant ? ` • ${transaction.merchant}` : ''}`}
                  />
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 'medium',
                      color: transaction.type === 'INCOME' ? 'success.main' : 'text.primary'
                    }}
                  >
                    {transaction.type === 'INCOME' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Active Budgets
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Budget Utilization
              </Typography>
              {dashboardData.budgetProgress.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {dashboardData.budgetProgress.slice(0, 4).map((budget) => (
                    <Box key={budget.id}>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        {budget.name}
                      </Typography>
                      <Chip 
                        label={`${budget.percentageUsed.toFixed(0)}% used`}
                        size="small" 
                        color={
                          budget.percentageUsed > 90 ? 'error' : 
                          budget.percentageUsed > 75 ? 'warning' : 'success'
                        }
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="caption" color="textSecondary" display="block">
                        {formatCurrency(budget.spent)} of {formatCurrency(budget.total)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No active budgets
                </Typography>
              )}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Layout>
  );
}
