import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import ErrorIcon from '@mui/icons-material/Error';
import Warning from '@mui/icons-material/Warning';
import CheckCircle from '@mui/icons-material/CheckCircle';

import { BudgetCardsProps } from '@/dto/budget-cards.dto';
import { formatCurrency, getProgressColor } from '@/lib/utils/budget';

const getStatusIcon = (percentage: number) => {
  if (percentage >= 100) return <ErrorIcon color="error" />;
  if (percentage >= 90) return <Warning color="warning" />;
  return <CheckCircle color="success" />;
};

const BudgetCards: React.FC<BudgetCardsProps> = ({ budgets }) => (
  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
    {budgets.map((budget) => (
      <Card key={budget.id}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {budget.name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {budget.category?.name || 'General'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {getStatusIcon(budget.percentageUsed)}
              <Chip 
                label={budget.period} 
                size="small" 
                variant="outlined"
              />
            </Box>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">
                {formatCurrency(budget.spent)} of {formatCurrency(budget.amount)}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {budget.percentageUsed.toFixed(1)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={Math.min(budget.percentageUsed, 100)}
              color={getProgressColor(budget.percentageUsed)}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="body2" color="textSecondary">
                Remaining
              </Typography>
              <Typography 
                variant="h6" 
                color={budget.remaining > 0 ? 'success.main' : 'error.main'}
                sx={{ fontWeight: 600 }}
              >
                {formatCurrency(budget.remaining)}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="body2" color="textSecondary">
                Period
              </Typography>
              <Typography variant="body2">
                {budget.startDate ? new Date(budget.startDate).toLocaleDateString() : 'N/A'} - {budget.endDate ? new Date(budget.endDate).toLocaleDateString() : 'N/A'}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    ))}
  </Box>
);

export default BudgetCards;
