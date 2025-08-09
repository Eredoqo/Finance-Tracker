'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  InputAdornment,
  Typography,
  Divider,
  Avatar,
  IconButton,
} from '@mui/material';
import {
  Close,
  CalendarToday,
  AttachMoney,
  Category,
  Description,
  CloudUpload,
  Groups,
} from '@mui/icons-material';

const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Travel',
  'Education',
  'Other'
];

interface ExpenseFormData {
  amount: number;
  description: string;
  category: string;
  date: string;
}

interface MUIExpenseFormProps {
  open: boolean;
  onClose: () => void;
  onAddExpense: (expense: ExpenseFormData) => void;
}

export default function MUIExpenseForm({ open, onClose, onAddExpense }: MUIExpenseFormProps) {
  const [formData, setFormData] = useState<ExpenseFormData>({
    amount: 0,
    description: '',
    category: 'Other',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.amount > 0 && formData.description.trim()) {
      onAddExpense(formData);
      setFormData({
        amount: 0,
        description: '',
        category: 'Other',
        date: new Date().toISOString().split('T')[0]
      });
      onClose();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
          Add New Expense
        </Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      
      <Divider />
      
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', gap: 3 }}>
            {/* Left Column - Main Form */}
            <Box sx={{ flex: 2 }}>
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField
                  fullWidth
                  label="Merchant"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Description />
                      </InputAdornment>
                    ),
                  }}
                  placeholder="e.g., Starbucks, Amazon, Uber"
                />
                
                <TextField
                  label="Amount"
                  name="amount"
                  type="number"
                  value={formData.amount || ''}
                  onChange={handleInputChange}
                  required
                  inputProps={{ step: 0.01, min: 0 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoney />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ minWidth: 150 }}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={formData.category}
                    label="Category"
                    onChange={(e) => handleSelectChange('category', e.target.value)}
                    startAdornment={
                      <InputAdornment position="start">
                        <Category />
                      </InputAdornment>
                    }
                  >
                    {EXPENSE_CATEGORIES.map(category => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label="Date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarToday />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ minWidth: 200 }}
                />
              </Box>

              <TextField
                fullWidth
                label="Description / Notes"
                multiline
                rows={3}
                placeholder="Add any additional details about this expense..."
                sx={{ mb: 2 }}
              />
            </Box>

            {/* Right Column - Additional Options */}
            <Box sx={{ flex: 1, pl: 2, borderLeft: '1px solid #e0e0e0' }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Additional Options
              </Typography>
              
              <Button
                fullWidth
                variant="outlined"
                startIcon={<CloudUpload />}
                sx={{ mb: 2, textTransform: 'none' }}
              >
                Upload Receipt
              </Button>
              
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Groups />}
                sx={{ mb: 3, textTransform: 'none' }}
              >
                Split Bill With
              </Button>

              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: '#e74c3c' }}>M</Avatar>
                <Avatar sx={{ width: 32, height: 32, bgcolor: '#3498db' }}>J</Avatar>
                <Avatar sx={{ width: 32, height: 32, bgcolor: '#2ecc71' }}>+</Avatar>
              </Box>
              
              <Typography variant="body2" color="textSecondary">
                Split this expense with team members
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        
        <Divider />
        
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button 
            onClick={onClose} 
            variant="outlined"
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained"
            sx={{ textTransform: 'none', px: 4 }}
          >
            Add Expense
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
