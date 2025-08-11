import React, { useState, useEffect } from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import NotificationsOutlined from "@mui/icons-material/NotificationsOutlined";

const userId = typeof window !== 'undefined' ? localStorage.getItem('user_id') : null;
type Notification = {
  id: string;
  message: string;
  createdAt: string;
};

const NotificationPopover: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const handleNotifClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleNotifClose = () => {
    setAnchorEl(null);
  };
  const notifOpen = Boolean(anchorEl);

  useEffect(() => {
    if (!userId) return;
    fetch(`/api/notifications?userId=${userId}`)
      .then(res => res.json())
      .then(data => setNotifications(data.notifications));
  }, [notifOpen]);

  return (
    <>
      <IconButton color="inherit" onClick={handleNotifClick}>
        <NotificationsOutlined />
      </IconButton>
      <Popover
        open={notifOpen}
        anchorEl={anchorEl}
        onClose={handleNotifClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ sx: { minWidth: 300, p: 2 } }}
      >
        <Typography variant="h6" sx={{ mb: 1 }}>
          Notifications
        </Typography>
        <Box>
          {notifications.length === 0 ? (
            <Typography variant="body2" sx={{ mb: 1 }}>
              No new notifications.
            </Typography>
          ) : (
            notifications.map((notif) => (
              <Box key={notif.id} sx={{ mb: 1, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="body2">{notif.message}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(notif.createdAt).toLocaleString()}
                </Typography>
              </Box>
            ))
          )}
        </Box>
      </Popover>
    </>
  );
};

export default NotificationPopover;
