'use client';

import React, { useState , useEffect} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Add from '@mui/icons-material/Add';
import CloudUpload from '@mui/icons-material/CloudUpload';
import Groups from '@mui/icons-material/Groups';
import Visibility from '@mui/icons-material/Visibility';
import Edit from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';

import { ExpenseReportsProps } from '@/dto/expense-reports.dto';
import ExpenseTableDataGrid from '../tables/ExpenseTableDataGrid';
import ExpenseStatusCards from '../tables/ExpenseStatusCards';


export default function ExpenseReports({ expenses, onAddExpense, onDeleteExpense }: ExpenseReportsProps) {
  const [selectedExpenses, setSelectedExpenses] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);
  const [statusCounts, setStatusCounts] = useState<{ [key: string]: number }>({});
  const [totalExpenses, setTotalExpenses] = useState(0);

  const fetchStatusCounts = async () => {
    try {
      const res = await fetch('/api/transactions?userId=user-1&type=EXPENSE');
      const data = await res.json();
      const counts: { [key: string]: number } = {};
      data.forEach((tx: { status?: string }) => {
        const status = tx.status?.toLowerCase() || 'unknown';
        counts[status] = (counts[status] || 0) + 1;
      });
      setStatusCounts(counts);
      setTotalExpenses(data.length);
    } catch {
      setStatusCounts({});
      setTotalExpenses(0);
    }
  };

  useEffect(() => {
    fetchStatusCounts();
  }, []);

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

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
          {totalExpenses} Total Expenses Generated
        </Typography>
        <ExpenseStatusCards statusCounts={statusCounts} />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 3 }}>
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
          sx={{ textTransform: 'none', ml: 2 }}
        >
          Upload Receipt (OCR)
        </Button>
      </Box>
      <ExpenseTableDataGrid 
        expenses={expenses} 
        page={page} 
        rowsPerPage={rowsPerPage} 
        selectedExpenses={selectedExpenses}
        handleSelectExpense={handleSelectExpense}
        handleSelectAll={handleSelectAll}
        handleMenuClick={handleMenuClick}
        setPage={setPage}
        setRowsPerPage={setRowsPerPage}
      />
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
