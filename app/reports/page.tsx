'use client';

import React, { useState, useEffect } from 'react';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Layout from '@/components/ui/Layout';
import ReportsHeader from '@/components/ui/ReportsHeader';
import ReportsHeaderActions from '@/components/ui/ReportsHeaderActions';
import { Transaction } from '@/dto/transaction.dto';
import { Budget } from '@/dto/budget.dto';
import { CategorySummary } from '@/dto/category-summary.dto';
import { getUserFromToken } from '@/lib/utils/auth';
import SummaryReport from '@/components/reports/SummaryReport';
import CategoryReport from '@/components/reports/CategoryReport';
import BudgetReport from '@/components/reports/BudgetReport';
import TransactionReport from '@/components/reports/TransactionReport';

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
      const user = getUserFromToken();
      if (!user || !user.id) throw new Error('User not authenticated');
      const userId = user.id;
      const transactionsResponse = await fetch(`/api/transactions?userId=${userId}&limit=1000`);
      if (!transactionsResponse.ok) throw new Error('Failed to fetch transactions');
      const transactionsData = await transactionsResponse.json();
      
      const budgetsResponse = await fetch(`/api/budgets?userId=${userId}`);
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


  const getFilteredTransactions = (): Transaction[] => {
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
      default:
        cutoffDate.setMonth(now.getMonth() - 1);
    }
    return transactions.filter(t => new Date(t.date) >= cutoffDate);
  };

  const filteredTransactions = getFilteredTransactions();

  const getSummaryReport = () => {
    const income = filteredTransactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);
    const expenses = filteredTransactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);
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
        <ReportsHeader title="Financial Reports">
          <ReportsHeaderActions
            timeRange={timeRange}
            setTimeRange={setTimeRange}
            reportType={reportType}
            setReportType={setReportType}
          />
        </ReportsHeader>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        {reportType === 'summary' && (
          <SummaryReport summaryData={summaryData} timeRange={timeRange} formatCurrency={formatCurrency} />
        )}
        {reportType === 'categories' && (
          <CategoryReport categoryBreakdown={categoryBreakdown} formatCurrency={formatCurrency} />
        )}
        {reportType === 'budgets' && (
          <BudgetReport budgetPerformance={budgetPerformance} formatCurrency={formatCurrency} />
        )}
        {reportType === 'transactions' && (
          <TransactionReport filteredTransactions={filteredTransactions} formatCurrency={formatCurrency} />
        )}
      </Box>
    </Layout>
  );
}
