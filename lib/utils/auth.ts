// Utility to decode JWT and get user info
export function getUserFromToken() {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log(payload);
    
    return {
      name: payload.name,
      email: payload.email ,
      id: payload.userId,
    };
  } catch {
    return null;
  }
}
