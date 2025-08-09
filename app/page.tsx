
'use client';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      window.location.replace('/login');
    } else {
      window.location.replace('/dashboard');
    }
  }, []);
  return null;
}
