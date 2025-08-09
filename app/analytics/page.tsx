'use client';

import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import Layout from '@/components/ui/Layout';

export default function AnalyticsPage() {
  return (
    <Layout title="Analytics">
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Analytics
        </Typography>
        
        <Paper sx={{ p: 3 }}>
          <Typography variant="body1">
            Analytics page content coming soon...
          </Typography>
        </Paper>
      </Box>
    </Layout>
  );
}
