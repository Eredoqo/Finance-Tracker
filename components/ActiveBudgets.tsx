import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { ActiveBudgetsProps } from '@/dto/active-budgets.dto';
import Chip from '@mui/material/Chip';

const ActiveBudgets: React.FC<ActiveBudgetsProps> = ({ budgets, formatCurrency }) => (
  <Paper sx={{ p: 2 }}>
    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
      Active Budgets
    </Typography>
    <Box sx={{ mb: 2 }}>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
        Budget Utilization
      </Typography>
      {budgets.length > 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {budgets.slice(0, 4).map((budget) => (
            <Box key={budget.id}>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                {budget.name}
              </Typography>
              <Chip 
                label={`${budget.percentageUsed.toFixed(0)}% used`}
                size="small" 
                color={
                  budget.percentageUsed > 90 ? 'error' : 
                  budget.percentageUsed > 75 ? 'warning' : 'success'
                }
                sx={{ mb: 1 }}
              />
              <Typography variant="caption" color="textSecondary" display="block">
                {formatCurrency(budget.spent)} of {formatCurrency(budget.total)}
              </Typography>
            </Box>
          ))}
        </Box>
      ) : (
        <Typography variant="body2" color="textSecondary">
          No active budgets
        </Typography>
      )}
    </Box>
  </Paper>
);

export default ActiveBudgets;
