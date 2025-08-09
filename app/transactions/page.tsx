'use client';

import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import Layout from '@/components/ui/Layout';

export default function TransactionsPage() {
  return (
    <Layout title="Transactions">
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Transactions
        </Typography>
        
        <Paper sx={{ p: 3 }}>
          <Typography variant="body1">
            Transactions page content coming soon...
          </Typography>
        </Paper>
      </Box>
    </Layout>
  );
}
