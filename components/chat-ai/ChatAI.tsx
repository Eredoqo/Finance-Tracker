'use client'

import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const ChatAI: React.FC = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    try {
      const res = await fetch('/api/ai-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.insight || data.insights || data.error }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Error contacting AI.' }]);
    }
    setInput('');
    setLoading(false);
  };

  return (
    <>
      <IconButton
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          zIndex: 1300,
          backgroundColor: 'background.paper',
          boxShadow: 3,
        }}
        onClick={() => setOpen(true)}
        size="large"
      >
        <ChatBubbleOutlineIcon fontSize="large" />
      </IconButton>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{
          position: 'fixed',
          bottom: 80,
          right: 32,
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 2,
          p: 2,
          maxHeight: '80vh',
          overflowY: 'auto',
        }}>
          <Typography variant="h6" gutterBottom>Ask AI</Typography>
          <Box sx={{ minHeight: 120, mb: 2 }}>
            {messages.map((msg, idx) => (
              <Box key={idx} sx={{ textAlign: msg.role === 'user' ? 'right' : 'left', my: 0.5 }}>
                <Typography variant="body2" color={msg.role === 'user' ? 'primary' : 'secondary'}>
                  <b>{msg.role === 'user' ? 'You' : 'AI'}:</b> {msg.content}
                </Typography>
              </Box>
            ))}
          </Box>
          <TextField
            fullWidth
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            disabled={loading}
            placeholder="Type your question..."
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            fullWidth
          >
            {loading ? 'Asking...' : 'Ask'}
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default ChatAI;
