'use client';

import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import Layout from '@/components/ui/Layout';

export default function ReportsPage() {
  return (
    <Layout title="Reports">
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Reports
        </Typography>
        
        <Paper sx={{ p: 3 }}>
          <Typography variant="body1">
            Reports page content coming soon...
          </Typography>
        </Paper>
      </Box>
    </Layout>
  );
}
