'use client';

import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';

import Add from '@mui/icons-material/Add';
import Refresh from '@mui/icons-material/Refresh';
import Schedule from '@mui/icons-material/Schedule';
import Warning from '@mui/icons-material/Warning';
import CheckCircle from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import Edit from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';
import Notifications from '@mui/icons-material/Notifications';
import CalendarToday from '@mui/icons-material/CalendarToday';
import AttachMoney from '@mui/icons-material/AttachMoney';
import TrendingUp from '@mui/icons-material/TrendingUp';
import Layout from '@/components/ui/Layout';
import { RecurringBill } from '@/dto/recurring-bill.dto';

// RecurringBill now imported from DTO

export default function RecurringPage() {
  const [recurringBills, setRecurringBills] = useState<RecurringBill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const fetchRecurringBills = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/recurring?userId=user-1');
      if (!response.ok) {
        throw new Error('Failed to fetch recurring bills');
      }
      const data = await response.json();
      setRecurringBills(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecurringBills();
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
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntilDue = (dueDateString: string) => {
    const dueDate = new Date(dueDateString);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getStatusColor = (status: string): 'error' | 'warning' | 'success' | 'default' => {
    switch (status) {
      case 'Overdue': return 'error';
      case 'Due Soon': return 'warning';
      case 'Upcoming': return 'success';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Overdue': return <ErrorIcon color="error" />;
      case 'Due Soon': return <Warning color="warning" />;
      case 'Upcoming': return <Schedule color="success" />;
      default: return <CheckCircle color="success" />;
    }
  };

  // Calculate summary statistics
  const totalMonthlyAmount = recurringBills
    .filter(bill => bill.frequency === 'Monthly')
    .reduce((sum, bill) => sum + bill.amount, 0);

  const dueSoonCount = recurringBills.filter(bill => 
    bill.status === 'Due Soon' || bill.status === 'Overdue'
  ).length;

  const upcomingThisWeek = recurringBills.filter(bill => {
    const days = getDaysUntilDue(bill.nextDueDate);
    return days >= 0 && days <= 7;
  });

  if (loading) {
    return (
      <Layout title="Recurring Bills">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout title="Recurring Bills">
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Recurring Bills & Subscriptions
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Refresh">
              <IconButton onClick={fetchRecurringBills}>
                <Refresh />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenDialog(true)}
            >
              Add Bill
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Summary Cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, mb: 4 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <AttachMoney color="primary" />
                <Typography variant="subtitle2" color="textSecondary">
                  Monthly Bills
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {formatCurrency(totalMonthlyAmount)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {recurringBills.filter(b => b.frequency === 'Monthly').length} bills
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Warning color="warning" />
                <Typography variant="subtitle2" color="textSecondary">
                  Due Soon
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 600, color: dueSoonCount > 0 ? 'warning.main' : 'text.primary' }}>
                {dueSoonCount}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Require attention
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <CalendarToday color="success" />
                <Typography variant="subtitle2" color="textSecondary">
                  This Week
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {upcomingThisWeek.length}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {formatCurrency(upcomingThisWeek.reduce((sum, bill) => sum + bill.amount, 0))}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 3 }}>
          {/* Bills Table */}
          <Paper>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                All Recurring Bills ({recurringBills.length})
              </Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Bill Name</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Frequency</TableCell>
                    <TableCell>Next Due</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recurringBills.map((bill) => (
                    <TableRow key={bill.id} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {bill.name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {bill.category} {bill.merchant && `• ${bill.merchant}`}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {formatCurrency(bill.amount)}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Avg: {formatCurrency(bill.averageAmount)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={bill.frequency} 
                          size="small" 
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(bill.nextDueDate)}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {getDaysUntilDue(bill.nextDueDate)} days
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          {getStatusIcon(bill.status)}
                          <Chip 
                            label={bill.status} 
                            size="small" 
                            color={getStatusColor(bill.status)}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Tooltip title="Edit">
                            <IconButton size="small">
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small" color="error">
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Upcoming Bills Sidebar */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Paper>
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Notifications />
                  Due This Week
                </Typography>
              </Box>
              <List>
                {upcomingThisWeek.length > 0 ? (
                  upcomingThisWeek.map((bill) => (
                    <React.Fragment key={bill.id}>
                      <ListItem>
                        <ListItemIcon>
                          {getStatusIcon(bill.status)}
                        </ListItemIcon>
                        <ListItemText
                          primary={bill.name}
                          secondary={`${formatCurrency(bill.amount)} • ${formatDate(bill.nextDueDate)}`}
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText
                      primary="No bills due this week"
                      secondary="You're all caught up!"
                    />
                  </ListItem>
                )}
              </List>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUp />
                Quick Stats
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Total Bills"
                    secondary={`${recurringBills.length} recurring bills`}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Most Expensive"
                    secondary={
                      recurringBills.length > 0 
                        ? `${recurringBills.reduce((max, bill) => 
                            bill.amount > max.amount ? bill : max
                          ).name} - ${formatCurrency(
                            recurringBills.reduce((max, bill) => 
                              bill.amount > max.amount ? bill : max
                            ).amount
                          )}`
                        : 'No bills'
                    }
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Average Bill"
                    secondary={
                      recurringBills.length > 0
                        ? formatCurrency(
                            recurringBills.reduce((sum, bill) => sum + bill.amount, 0) / recurringBills.length
                          )
                        : '$0'
                    }
                  />
                </ListItem>
              </List>
            </Paper>
          </Box>
        </Box>

        {recurringBills.length === 0 && !loading && (
          <Paper sx={{ p: 6, textAlign: 'center' }}>
            <Typography variant="h6" color="textSecondary" sx={{ mb: 2 }}>
              No recurring bills found
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              We analyze your transactions to identify recurring patterns. Add more transactions or manually add bills.
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenDialog(true)}
            >
              Add Your First Bill
            </Button>
          </Paper>
        )}

        {/* Add Bill Dialog - Placeholder */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add Recurring Bill</DialogTitle>
          <DialogContent>
            <Alert severity="info" sx={{ mb: 2 }}>
              Manual bill creation coming soon! For now, we automatically detect recurring bills from your transaction history.
            </Alert>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
}
