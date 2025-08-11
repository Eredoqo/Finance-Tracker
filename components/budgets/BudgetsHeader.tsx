import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Add from '@mui/icons-material/Add';
import Refresh from '@mui/icons-material/Refresh';

import { BudgetsHeaderProps } from '@/dto/budgets-header.dto';

const BudgetsHeader: React.FC<BudgetsHeaderProps> = ({ onRefresh }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
    <Typography variant="h4" sx={{ fontWeight: 600 }}>
      Budget Management
    </Typography>
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Tooltip title="Refresh">
        <IconButton onClick={onRefresh}>
          <Refresh />
        </IconButton>
      </Tooltip>
      <Button
        variant="contained"
        startIcon={<Add />}
      >
        Create Budget
      </Button>
    </Box>
  </Box>
);

export default BudgetsHeader;
