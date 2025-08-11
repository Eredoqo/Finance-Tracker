import React from 'react';
import { Card, CardContent, Box, Typography, Divider, List, ListItem, ListItemText, Chip, Paper } from '@mui/material';
import { SummaryReportProps } from '@/dto/summary-report.dto';
import Assessment from '@mui/icons-material/Assessment';
import TrendingUp from '@mui/icons-material/TrendingUp';
import TrendingDown from '@mui/icons-material/TrendingDown';
import AttachMoney from '@mui/icons-material/AttachMoney';

const SummaryReport: React.FC<SummaryReportProps> = ({ summaryData, timeRange, formatCurrency }) => (
  <Box>
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Assessment />
        Financial Summary - {timeRange.replace(/(\d+)(\w+)/, '$1 $2')}
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, mb: 3 }}>
        <Card variant="outlined">
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <TrendingUp color="success" />
              <Typography variant="subtitle2" color="textSecondary">
                Total Income
              </Typography>
            </Box>
            <Typography variant="h4" color="success.main">
              {formatCurrency(summaryData.income)}
            </Typography>
          </CardContent>
        </Card>
        <Card variant="outlined">
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <TrendingDown color="error" />
              <Typography variant="subtitle2" color="textSecondary">
                Total Expenses
              </Typography>
            </Box>
            <Typography variant="h4" color="error.main">
              {formatCurrency(summaryData.expenses)}
            </Typography>
          </CardContent>
        </Card>
        <Card variant="outlined">
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <AttachMoney color="primary" />
              <Typography variant="subtitle2" color="textSecondary">
                Net Income
              </Typography>
            </Box>
            <Typography 
              variant="h4" 
              color={summaryData.netIncome > 0 ? 'success.main' : 'error.main'}
            >
              {formatCurrency(summaryData.netIncome)}
            </Typography>
          </CardContent>
        </Card>
      </Box>
      <Divider sx={{ my: 3 }} />
      <List>
        <ListItem>
          <ListItemText
            primary="Transaction Count"
            secondary={`${summaryData.transactionCount} transactions`}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Average Transaction"
            secondary={formatCurrency(summaryData.avgTransactionAmount)}
          />
        </ListItem>
        <ListItem>
          <ListItemText primary="Savings Rate" />
          <Chip
            label={`${summaryData.savingsRate.toFixed(1)}%`}
            color={summaryData.savingsRate > 20 ? 'success' : summaryData.savingsRate > 10 ? 'warning' : 'error'}
            size="small"
          />
        </ListItem>
      </List>
    </Paper>
  </Box>
);

export default SummaryReport;
