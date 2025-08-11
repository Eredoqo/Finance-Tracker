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
  Tooltip,
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
  { id: 'expenses', label: 'Expense Reports', icon: <Receipt />, route: '/expenses' },
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
        width: open ? drawerWidth : "",
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : "",
          boxSizing: 'border-box',
          backgroundColor: '#004225',
          color: '#ecf0f1',
          borderRight: 'none',
          transition: 'width 0.3s',
          overflowX: 'hidden',
        },
      }}
    >
      <Box sx={{ overflow: 'auto', mt: 8, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <List sx={{ flexGrow: 1 }}>
          {menuItems.map((item) => (
            <ListItem key={item.id} disablePadding sx={{ display: 'block' }}>
              <Tooltip title={!open ? item.label : ''} placement="right">
                <ListItemButton
                  selected={pathname === item.route}
                  onClick={() => handleNavigation(item.route)}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    '&.Mui-selected': {
                      backgroundColor: '#8fbc8f',
                      '&:hover': {
                        backgroundColor: '#9caf88',
                      },
                    },
                    '&:hover': {
                      backgroundColor: '#9caf88',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: '#ecf0f1',
                      minWidth: 0,
                      mr: open ? 2 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {open && (
                    <ListItemText
                      primary={item.label}
                      sx={{
                        '& .MuiTypography-root': {
                          fontSize: '0.9rem',
                          fontWeight: pathname === item.route ? 600 : 400,
                        },
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ backgroundColor: '#34495e', my: 1 }} />

        <List>
          <ListItem disablePadding sx={{ display: 'block' }}>
            <Tooltip title={!open ? 'Logout' : ''} placement="right">
              <ListItemButton
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    localStorage.removeItem('token');
                    document.cookie = 'token=; Max-Age=0; path=/;';
                  }
                  router.push('/login');
                }}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  '&:hover': {
                    backgroundColor: '#e74c3c',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: '#ecf0f1',
                    minWidth: 0,
                    mr: open ? 2 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <Logout />
                </ListItemIcon>
                {open && (
                  <ListItemText
                    primary="Logout"
                    sx={{
                      '& .MuiTypography-root': {
                        fontSize: '0.9rem',
                      },
                    }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}
