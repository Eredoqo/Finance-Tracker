import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Add from '@mui/icons-material/Add';

const NoBudgets: React.FC = () => (
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
);

export default NoBudgets;
