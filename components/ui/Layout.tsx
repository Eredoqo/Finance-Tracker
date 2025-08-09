'use client';

import React, { useState } from 'react';
import { Box, CssBaseline } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';


interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function Layout({ children, title }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      <Header 
        onMenuClick={handleMenuClick} 
        title={title}
      />
      
      <Sidebar 
        open={sidebarOpen}
      />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          mt: 8, // Account for AppBar height
          transition: 'margin 0.3s ease',
          backgroundColor: '#f5f5f5',
          minHeight: '100vh',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
