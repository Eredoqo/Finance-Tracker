'use client';

import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import Layout from '@/components/ui/Layout';

export default function SettingsPage() {
  return (
    <Layout title="Settings">
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Settings
        </Typography>
        
        <Paper sx={{ p: 3 }}>
          <Typography variant="body1">
            Settings page content coming soon...
          </Typography>
        </Paper>
      </Box>
    </Layout>
  );
}
