import React from 'react';
import { Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Chip, Typography } from '@mui/material';
import Category from '@mui/icons-material/Category';

import { CategoryReportProps } from '@/dto/category-report.dto';
import { CategorySummary } from '@/dto/category-summary.dto';

const CategoryReport: React.FC<CategoryReportProps> = ({ categoryBreakdown, formatCurrency }) => (
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
          {categoryBreakdown.map((category: CategorySummary) => (
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
);

export default CategoryReport;
