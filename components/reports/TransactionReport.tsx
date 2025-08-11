import React from 'react';
import { Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Chip, Typography } from '@mui/material';

import { TransactionReportProps } from '@/dto/transaction-report.dto';
import { Transaction } from '@/dto/transaction.dto';

const TransactionReport: React.FC<TransactionReportProps> = ({ filteredTransactions, formatCurrency }) => (
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
          {filteredTransactions.slice(0, 100).map((transaction: Transaction) => (
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
);

export default TransactionReport;
