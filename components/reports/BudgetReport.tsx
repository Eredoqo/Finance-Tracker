import React from 'react';
import { Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Chip, Typography } from '@mui/material';
import DateRange from '@mui/icons-material/DateRange';

import { BudgetReportProps } from '@/dto/budget-report.dto';
import { Budget } from '@/dto/budget.dto';

const BudgetReport: React.FC<BudgetReportProps> = ({ budgetPerformance, formatCurrency }) => (
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
          {budgetPerformance.map((budget: Budget) => (
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
);

export default BudgetReport;
