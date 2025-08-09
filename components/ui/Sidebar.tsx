'use client';

import React from 'react';
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
  Settings,
  CreditCard,
  Refresh,
  Business,
  TrendingUp,
} from '@mui/icons-material';

const drawerWidth = 240;

interface SidebarProps {
  open: boolean;
  selectedItem: string;
  onItemSelect: (item: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <Home /> },
  { id: 'expenses', label: 'Expense Reports', icon: <Receipt /> },
  { id: 'analytics', label: 'Analytics', icon: <BarChart /> },
  { id: 'cards', label: 'Credit Cards', icon: <CreditCard /> },
  { id: 'recurring', label: 'Recurring Bills', icon: <Refresh /> },
  { id: 'vendors', label: 'Vendors', icon: <Business /> },
  { id: 'trends', label: 'Spending Trends', icon: <TrendingUp /> },
];

export default function Sidebar({ open, selectedItem, onItemSelect }: SidebarProps) {
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
      <Box sx={{ overflow: 'auto', mt: 8 }}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                selected={selectedItem === item.id}
                onClick={() => onItemSelect(item.id)}
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
                      fontWeight: selectedItem === item.id ? 600 : 400
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
              sx={{
                '&:hover': {
                  backgroundColor: '#34495e',
                },
                py: 1.5,
              }}
            >
              <ListItemIcon sx={{ color: '#ecf0f1', minWidth: 40 }}>
                <Settings />
              </ListItemIcon>
              <ListItemText 
                primary="Settings"
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
