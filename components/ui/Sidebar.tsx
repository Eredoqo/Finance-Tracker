'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
} from '@mui/material';
import {
  Home,
  Receipt,
  BarChart,
  Logout,
  CreditCard,
  Refresh,
  Business,
  TrendingUp,
} from '@mui/icons-material';

const drawerWidth = 240;

interface SidebarProps {
  open: boolean;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <Home />, route: '/dashboard' },
  { id: 'expenses', label: 'Expense Reports', icon: <Receipt />, route: '/' },
  { id: 'transactions', label: 'Transactions', icon: <CreditCard />, route: '/transactions' },
  { id: 'budgets', label: 'Budgets', icon: <Business />, route: '/budgets' },
  { id: 'reports', label: 'Reports', icon: <BarChart />, route: '/reports' },
  { id: 'analytics', label: 'Analytics', icon: <TrendingUp />, route: '/analytics' },
  { id: 'recurring', label: 'Recurring Bills', icon: <Refresh />, route: '/recurring' },
];

export default function Sidebar({ open }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (route: string) => {
    router.push(route);
  };
  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#2c3e50',
          color: '#ecf0f1',
          borderRight: 'none',
        },
      }}
    >
      <Box sx={{ overflow: 'auto', mt: 8, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <List sx={{ flexGrow: 1 }}>
          {menuItems.map((item) => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                selected={pathname === item.route}
                onClick={() => handleNavigation(item.route)}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: '#3498db',
                    '&:hover': {
                      backgroundColor: '#2980b9',
                    },
                  },
                  '&:hover': {
                    backgroundColor: '#34495e',
                  },
                  py: 1.5,
                }}
              >
                <ListItemIcon sx={{ color: '#ecf0f1', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  sx={{ 
                    '& .MuiTypography-root': { 
                      fontSize: '0.9rem',
                      fontWeight: pathname === item.route ? 600 : 400
                    } 
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        
        <Divider sx={{ backgroundColor: '#34495e', my: 1 }} />
        
        <List>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                // Add logout logic here
                console.log('Logout clicked');
              }}
              sx={{
                '&:hover': {
                  backgroundColor: '#e74c3c',
                },
                py: 1.5,
              }}
            >
              <ListItemIcon sx={{ color: '#ecf0f1', minWidth: 40 }}>
                <Logout />
              </ListItemIcon>
              <ListItemText 
                primary="Logout"
                sx={{ 
                  '& .MuiTypography-root': { 
                    fontSize: '0.9rem',
                  } 
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}
