import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { ExpenseStatusCardsProps } from '@/dto/expense-status-cards.dto';

const STATUS_LIST = ['draft', 'pending', 'approved', 'rejected', 'processing', 'reimbursed'];

export default function ExpenseStatusCards({ statusCounts }: ExpenseStatusCardsProps) {
  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
      {STATUS_LIST.map((status) => (
        <Card key={status} sx={{ textAlign: 'center', minHeight: 100, minWidth: 120, flex: 1 }}>
          <CardContent sx={{ py: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              {statusCounts[status] || 0}
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
  );
}
