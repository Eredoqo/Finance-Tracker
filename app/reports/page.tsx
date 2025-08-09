'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Card,
  CardContent,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  Download,
  TrendingUp,
  TrendingDown,
  Assessment,
  DateRange,
  Category,
  AttachMoney,
} from '@mui/icons-material';
import Layout from '@/components/ui/Layout';

interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  type: 'INCOME' | 'EXPENSE';
  status: string;
  merchant?: string;
}

interface Budget {
  id: string;
  name: string;
  amount: number;
  spent: number;
  remaining: number;
  percentageUsed: number;
  period: string;
  category: {
    name: string;
    color: string;
  } | null;
}

interface CategorySummary {
  name: string;
  totalAmount: number;
  transactionCount: number;
  averageTransaction: number;
  percentage: number;
}

export default function ReportsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reportType, setReportType] = useState('summary');
  const [timeRange, setTimeRange] = useState('1month');

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch transactions
      const transactionsResponse = await fetch(`/api/transactions?userId=user-1&limit=1000`);
      if (!transactionsResponse.ok) throw new Error('Failed to fetch transactions');
      const transactionsData = await transactionsResponse.json();
      
      // Fetch budgets
      const budgetsResponse = await fetch('/api/budgets?userId=user-1');
      if (!budgetsResponse.ok) throw new Error('Failed to fetch budgets');
      const budgetsData = await budgetsResponse.json();
      
      setTransactions(transactionsData);
      setBudgets(budgetsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Filter transactions based on time range
  const getFilteredTransactions = () => {
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (timeRange) {
      case '1week':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case '1month':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case '3months':
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
      case '6months':
        cutoffDate.setMonth(now.getMonth() - 6);
        break;
      case '1year':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        cutoffDate.setMonth(now.getMonth() - 1);
    }

    return transactions.filter(t => new Date(t.date) >= cutoffDate);
  };

  const filteredTransactions = getFilteredTransactions();

  // Generate summary report
  const getSummaryReport = () => {
    const income = filteredTransactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = filteredTransactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);

    const netIncome = income - expenses;
    const transactionCount = filteredTransactions.length;
    const avgTransactionAmount = expenses / filteredTransactions.filter(t => t.type === 'EXPENSE').length || 0;

    return {
      income,
      expenses,
      netIncome,
      transactionCount,
      avgTransactionAmount,
      savingsRate: income > 0 ? (netIncome / income) * 100 : 0,
    };
  };

  // Generate category breakdown
  const getCategoryBreakdown = (): CategorySummary[] => {
    const expenseTransactions = filteredTransactions.filter(t => t.type === 'EXPENSE');
    const categoryData: { [key: string]: { total: number; count: number } } = {};
    const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);

    expenseTransactions.forEach(transaction => {
      if (!categoryData[transaction.category]) {
        categoryData[transaction.category] = { total: 0, count: 0 };
      }
      categoryData[transaction.category].total += transaction.amount;
      categoryData[transaction.category].count += 1;
    });

    return Object.entries(categoryData)
      .map(([name, data]) => ({
        name,
        totalAmount: data.total,
        transactionCount: data.count,
        averageTransaction: data.total / data.count,
        percentage: (data.total / totalExpenses) * 100,
      }))
      .sort((a, b) => b.totalAmount - a.totalAmount);
  };

  // Budget performance report
  const getBudgetPerformance = () => {
    return budgets.map(budget => ({
      ...budget,
      status: budget.percentageUsed >= 100 ? 'Over Budget' : 
              budget.percentageUsed >= 90 ? 'Near Limit' : 
              budget.percentageUsed >= 75 ? 'On Track' : 'Under Budget',
      variance: budget.remaining,
    }));
  };

  const summaryData = getSummaryReport();
  const categoryBreakdown = getCategoryBreakdown();
  const budgetPerformance = getBudgetPerformance();

  if (loading) {
    return (
      <Layout title="Reports">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout title="Reports">
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Financial Reports
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Time Range</InputLabel>
              <Select
                value={timeRange}
                label="Time Range"
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <MenuItem value="1week">Last Week</MenuItem>
                <MenuItem value="1month">Last Month</MenuItem>
                <MenuItem value="3months">Last 3 Months</MenuItem>
                <MenuItem value="6months">Last 6 Months</MenuItem>
                <MenuItem value="1year">Last Year</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Report Type</InputLabel>
              <Select
                value={reportType}
                label="Report Type"
                onChange={(e) => setReportType(e.target.value)}
              >
                <MenuItem value="summary">Summary</MenuItem>
                <MenuItem value="categories">Categories</MenuItem>
                <MenuItem value="budgets">Budgets</MenuItem>
                <MenuItem value="transactions">Transactions</MenuItem>
              </Select>
            </FormControl>
            
            <Button
              variant="outlined"
              startIcon={<Download />}
            >
              Export PDF
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Summary Report */}
        {reportType === 'summary' && (
          <Box>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Assessment />
                Financial Summary - {timeRange.replace(/(\d+)(\w+)/, '$1 $2')}
              </Typography>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, mb: 3 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <TrendingUp color="success" />
                      <Typography variant="subtitle2" color="textSecondary">
                        Total Income
                      </Typography>
                    </Box>
                    <Typography variant="h4" color="success.main">
                      {formatCurrency(summaryData.income)}
                    </Typography>
                  </CardContent>
                </Card>
                
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <TrendingDown color="error" />
                      <Typography variant="subtitle2" color="textSecondary">
                        Total Expenses
                      </Typography>
                    </Box>
                    <Typography variant="h4" color="error.main">
                      {formatCurrency(summaryData.expenses)}
                    </Typography>
                  </CardContent>
                </Card>
                
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <AttachMoney color="primary" />
                      <Typography variant="subtitle2" color="textSecondary">
                        Net Income
                      </Typography>
                    </Box>
                    <Typography 
                      variant="h4" 
                      color={summaryData.netIncome > 0 ? 'success.main' : 'error.main'}
                    >
                      {formatCurrency(summaryData.netIncome)}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>

              <Divider sx={{ my: 3 }} />
              
              <List>
                <ListItem>
                  <ListItemText
                    primary="Transaction Count"
                    secondary={`${summaryData.transactionCount} transactions`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Average Transaction"
                    secondary={formatCurrency(summaryData.avgTransactionAmount)}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Savings Rate"
                  />
                  <Chip
                    label={`${summaryData.savingsRate.toFixed(1)}%`}
                    color={summaryData.savingsRate > 20 ? 'success' : summaryData.savingsRate > 10 ? 'warning' : 'error'}
                    size="small"
                  />
                </ListItem>
              </List>
            </Paper>
          </Box>
        )}

        {/* Category Report */}
        {reportType === 'categories' && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Category />
              Spending by Category
            </Typography>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Category</TableCell>
                    <TableCell align="right">Total Amount</TableCell>
                    <TableCell align="right">Transactions</TableCell>
                    <TableCell align="right">Average</TableCell>
                    <TableCell align="right">Percentage</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categoryBreakdown.map((category) => (
                    <TableRow key={category.name}>
                      <TableCell>{category.name}</TableCell>
                      <TableCell align="right">{formatCurrency(category.totalAmount)}</TableCell>
                      <TableCell align="right">{category.transactionCount}</TableCell>
                      <TableCell align="right">{formatCurrency(category.averageTransaction)}</TableCell>
                      <TableCell align="right">
                        <Chip
                          label={`${category.percentage.toFixed(1)}%`}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {/* Budget Report */}
        {reportType === 'budgets' && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <DateRange />
              Budget Performance
            </Typography>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Budget Name</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell align="right">Budget</TableCell>
                    <TableCell align="right">Spent</TableCell>
                    <TableCell align="right">Remaining</TableCell>
                    <TableCell align="right">Usage</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {budgetPerformance.map((budget) => (
                    <TableRow key={budget.id}>
                      <TableCell>{budget.name}</TableCell>
                      <TableCell>{budget.category?.name || 'General'}</TableCell>
                      <TableCell align="right">{formatCurrency(budget.amount)}</TableCell>
                      <TableCell align="right">{formatCurrency(budget.spent)}</TableCell>
                      <TableCell align="right">{formatCurrency(budget.remaining)}</TableCell>
                      <TableCell align="right">{budget.percentageUsed.toFixed(1)}%</TableCell>
                      <TableCell>
                        <Chip
                          label={budget.status}
                          size="small"
                          color={
                            budget.status === 'Over Budget' ? 'error' :
                            budget.status === 'Near Limit' ? 'warning' :
                            budget.status === 'On Track' ? 'success' : 'default'
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {/* Transaction Report */}
        {reportType === 'transactions' && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Transaction History ({filteredTransactions.length} transactions)
            </Typography>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTransactions.slice(0, 100).map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {new Date(transaction.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>{transaction.category}</TableCell>
                      <TableCell>
                        <Chip
                          label={transaction.type}
                          size="small"
                          color={transaction.type === 'INCOME' ? 'success' : 'default'}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          color={transaction.type === 'INCOME' ? 'success.main' : 'text.primary'}
                          sx={{ fontWeight: 600 }}
                        >
                          {transaction.type === 'INCOME' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={transaction.status}
                          size="small"
                          color={transaction.status === 'APPROVED' ? 'success' : 'warning'}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Box>
    </Layout>
  );
}
