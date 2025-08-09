'use client';

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  IconButton,
  Menu,
  MenuItem,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Search,
  FilterList,
  Add,
  MoreVert,
  CloudUpload,
  Groups,
  Visibility,
  Edit,
  Delete,
} from '@mui/icons-material';
import { Expense } from '@/types/expense';

interface ExpenseReportsProps {
  expenses: Expense[];
  onAddExpense: () => void;
  onDeleteExpense: (id: string) => void;
}

export default function ExpenseReports({ expenses, onAddExpense, onDeleteExpense }: ExpenseReportsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExpenses, setSelectedExpenses] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);

  // Mock data for status distribution
  const statusCounts = {
    draft: 15,
    pending: 40,
    approved: 60,
    rejected: 5,
    processing: 2,
    reimbursed: 3,
  };

  const totalExpenses = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, expenseId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedExpenseId(expenseId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedExpenseId(null);
  };

  const handleSelectExpense = (expenseId: string) => {
    setSelectedExpenses(prev => 
      prev.includes(expenseId) 
        ? prev.filter(id => id !== expenseId)
        : [...prev, expenseId]
    );
  };

  const handleSelectAll = () => {
    if (selectedExpenses.length === expenses.length) {
      setSelectedExpenses([]);
    } else {
      setSelectedExpenses(expenses.map(expense => expense.id));
    }
  };

  const filteredExpenses = expenses.filter(expense =>
    expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedExpenses = filteredExpenses.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-CA'); // YYYY-MM-DD format
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
          {totalExpenses} Total Expenses Generated
        </Typography>
        
        {/* Status Cards */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          {Object.entries(statusCounts).map(([status, count]) => (
            <Card key={status} sx={{ textAlign: 'center', minHeight: 100, minWidth: 120, flex: 1 }}>
              <CardContent sx={{ py: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {count}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="textSecondary"
                  sx={{ textTransform: 'capitalize' }}
                >
                  {status}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      {/* Controls Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            placeholder="Search by merchant or description"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            size="small"
            sx={{ minWidth: 300 }}
          />
          <Button
            startIcon={<FilterList />}
            variant="outlined"
            size="small"
          >
            More Filters
          </Button>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={onAddExpense}
            sx={{ textTransform: 'none' }}
          >
            Add New Expense
          </Button>
          <Button
            variant="outlined"
            startIcon={<CloudUpload />}
            sx={{ textTransform: 'none' }}
          >
            Upload Receipt (OCR)
          </Button>
        </Box>
      </Box>

      {/* Expense Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedExpenses.length === expenses.length && expenses.length > 0}
                    indeterminate={selectedExpenses.length > 0 && selectedExpenses.length < expenses.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Merchant</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedExpenses.map((expense) => (
                <TableRow key={expense.id} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedExpenses.includes(expense.id)}
                      onChange={() => handleSelectExpense(expense.id)}
                    />
                  </TableCell>
                  <TableCell>{formatDate(expense.date)}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                        {expense.description.charAt(0)}
                      </Avatar>
                      {expense.description}
                    </Box>
                  </TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>{formatCurrency(expense.amount)}</TableCell>
                  <TableCell>
                    <Chip 
                      label="Approved" 
                      color="success" 
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton size="small">
                        <Visibility fontSize="small" />
                      </IconButton>
                      <IconButton size="small">
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small"
                        onClick={(e) => handleMenuClick(e, expense.id)}
                      >
                        <MoreVert fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredExpenses.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <Visibility fontSize="small" sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Edit fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Groups fontSize="small" sx={{ mr: 1 }} />
          Split Bill
        </MenuItem>
        <Divider />
        <MenuItem 
          onClick={() => {
            if (selectedExpenseId) {
              onDeleteExpense(selectedExpenseId);
            }
            handleMenuClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
}
