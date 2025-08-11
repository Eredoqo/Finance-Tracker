import React from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import { ReportsHeaderActionsProps } from '@/dto/reports-header-actions.dto';
import Button from '@mui/material/Button';

const ReportsHeaderActions: React.FC<ReportsHeaderActionsProps> = ({ timeRange, setTimeRange, reportType, setReportType }) => (
  <Box sx={{ display: 'flex', gap: 2 }}>
    <FormControl size="small" sx={{ minWidth: 120 }}>
      <InputLabel>Time Range</InputLabel>
      <Select
        value={timeRange}
        label="Time Range"
        onChange={(e) => setTimeRange(e.target.value as string)}
      >
        <MenuItem value="1week">Last Week</MenuItem>
        <MenuItem value="1month">Last Month</MenuItem>
        <MenuItem value="3months">Last 3 Months</MenuItem>
        <MenuItem value="6months">Last 6 Months</MenuItem>
        <MenuItem value="1year">Last Year</MenuItem>
      </Select>
    </FormControl>
    <FormControl size="small" sx={{ minWidth: 120 }}>
      <InputLabel>Report Type</InputLabel>
      <Select
        value={reportType}
        label="Report Type"
        onChange={(e) => setReportType(e.target.value as string)}
      >
        <MenuItem value="summary">Summary</MenuItem>
        <MenuItem value="categories">Categories</MenuItem>
        <MenuItem value="budgets">Budgets</MenuItem>
        <MenuItem value="transactions">Transactions</MenuItem>
      </Select>
    </FormControl>
    <Button variant="outlined">Export PDF</Button>
  </Box>
);

export default ReportsHeaderActions;
