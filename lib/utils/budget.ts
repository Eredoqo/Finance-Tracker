
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const getProgressColor = (percentage: number): 'error' | 'warning' | 'success' => {
  if (percentage >= 90) return 'error';
  if (percentage >= 75) return 'warning';
  return 'success';
};
