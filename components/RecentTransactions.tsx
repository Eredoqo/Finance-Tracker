import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import { RecentTransactionsProps } from '@/dto/recent-transactions.dto';
import Receipt from '@mui/icons-material/Receipt';

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions, formatCurrency, formatDate }) => (
  <Paper sx={{ p: 2 }}>
    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
      Recent Transactions
    </Typography>
    <List>
      {transactions.slice(0, 5).map((transaction) => (
        <ListItem key={transaction.id} divider>
          <ListItemIcon>
            <Receipt />
          </ListItemIcon>
          <ListItemText
            primary={transaction.description}
            secondary={`${transaction.category} • ${formatDate(transaction.date)}${transaction.merchant ? ` • ${transaction.merchant}` : ''}`}
          />
          <Typography
            variant="body1"
            sx={{
              fontWeight: 'medium',
              color: transaction.type === 'INCOME' ? 'success.main' : 'text.primary'
            }}
          >
            {transaction.type === 'INCOME' ? '+' : '-'}{formatCurrency(transaction.amount)}
          </Typography>
        </ListItem>
      ))}
    </List>
  </Paper>
);

export default RecentTransactions;
