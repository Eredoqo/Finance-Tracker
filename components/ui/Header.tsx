"use client";

import React, { useState, useEffect } from "react";
import { getUserFromToken } from "@/lib/utils/auth";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import { Menu as MenuIcon } from "@mui/icons-material";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationPopover from "./NotificationPopover";

interface HeaderProps {
  onMenuClick: () => void;
  title?: string;
}

export default function Header({
  onMenuClick,
  title = "Expense Reports",
}: HeaderProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [user, setUser] = useState<{
    name?: string;
    email?: string;
    id?: string;
  } | null>(null);

  useEffect(() => {
    setUser(getUserFromToken());
  }, []);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getInitials = (name?: string) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return parts[0][0] + parts[parts.length - 1][0];
    }
    return parts[0][0];
  }

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: "#004225",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={onMenuClick}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            fontWeight: 500,
            color: "#ecf0f1",
          }}
        >
          {title}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Chip
            label={user?.name || user?.email || "Guest"}
            size="small"
            sx={{
              backgroundColor: "rgba(255,255,255,0.1)",
              color: "#ecf0f1",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          />
          <NotificationPopover />
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <Avatar sx={{ width: 40, height: 40, bgcolor: "#757575" }}>
              {getInitials(user?.name)}
            </Avatar>
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            sx={{ mt: 6, ml: 2.5 }}
            slotProps={{
              paper: { sx: { minWidth: 250 } },
            }}
          >
            <MenuItem
              sx={{ display: "flex", alignItems: "center" }}
              onClick={handleClose}
            >
              <AccountCircleIcon color="action" sx={{ mr: 1, fontSize: 29 }} />
              Profile
            </MenuItem>
            <MenuItem
              sx={{ display: "flex", alignItems: "center" }}
              onClick={handleClose}
            >
              <AccountCircleIcon color="action" sx={{ mr: 1, fontSize: 29 }} />
              My account
            </MenuItem>
            <MenuItem
              sx={{ display: "flex", alignItems: "center" }}
              onClick={handleClose}
            >
              <SettingsIcon color="action" sx={{ mr: 1, fontSize: 29 }} />
              Settings
            </MenuItem>
            <MenuItem
              sx={{ display: "flex", alignItems: "center" }}
              onClick={handleClose}
            >
              <LogoutIcon color="action" sx={{ mr: 1, fontSize: 29 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
