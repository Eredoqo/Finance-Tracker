'use client';

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AttachMoney,
  Receipt,
  CreditCard,
  Savings,
} from '@mui/icons-material';
import Layout from '@/components/ui/Layout';

const mockData = {
  totalIncome: 8500,
  totalExpenses: 6200,
  netIncome: 2300,
  transactionCount: 45,
  budgetUtilization: 78,
  recentTransactions: [
    { id: 1, description: 'Grocery Store', amount: 156.78, category: 'Food', date: '2025-08-09' },
    { id: 2, description: 'Gas Station', amount: 45.20, category: 'Transportation', date: '2025-08-08' },
    { id: 3, description: 'Coffee Shop', amount: 12.50, category: 'Food', date: '2025-08-08' },
    { id: 4, description: 'Netflix', amount: 15.99, category: 'Entertainment', date: '2025-08-07' },
    { id: 5, description: 'Salary', amount: 3000, category: 'Income', date: '2025-08-01' },
  ],
};

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

  return (
    <Layout title="Dashboard">
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Financial Overview
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
            title="Total Income"
            value={formatCurrency(mockData.totalIncome)}
            icon={<AttachMoney fontSize="large" />}
            trend="up"
            trendValue="+12.5%"
          />
          <StatCard
            title="Total Expenses"
            value={formatCurrency(mockData.totalExpenses)}
            icon={<Receipt fontSize="large" />}
            trend="down"
            trendValue="-8.2%"
          />
          <StatCard
            title="Net Income"
            value={formatCurrency(mockData.netIncome)}
            icon={<Savings fontSize="large" />}
            trend="up"
            trendValue="+15.3%"
          />
          <StatCard
            title="Transactions"
            value={mockData.transactionCount.toString()}
            icon={<CreditCard fontSize="large" />}
          />
        </Box>

        {/* Recent Transactions */}
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
              {mockData.recentTransactions.map((transaction) => (
                <ListItem key={transaction.id} divider>
                  <ListItemIcon>
                    <Receipt />
                  </ListItemIcon>
                  <ListItemText
                    primary={transaction.description}
                    secondary={`${transaction.category} • ${formatDate(transaction.date)}`}
                  />
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 'medium',
                      color: transaction.category === 'Income' ? 'success.main' : 'text.primary'
                    }}
                  >
                    {transaction.category === 'Income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Budget Overview
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Monthly Budget Utilization
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                {mockData.budgetUtilization}%
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip label="Food: 85%" size="small" color="warning" />
                <Chip label="Transport: 65%" size="small" color="success" />
                <Chip label="Shopping: 92%" size="small" color="error" />
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Layout>
  );
}
