import React from 'react';
import AttachMoney from '@mui/icons-material/AttachMoney';
import Receipt from '@mui/icons-material/Receipt';
import Savings from '@mui/icons-material/Savings';
import CreditCard from '@mui/icons-material/CreditCard';
import StatCard from '@/components/StatisticCard';

import { StatCardsProps } from '@/dto/stat-cards.dto';

const StatCards: React.FC<StatCardsProps> = ({ summary, formatCurrency }) => {
  const cards: Array<{
    title: string;
    value: string;
    icon: React.ReactNode;
    trend: 'up' | 'down' | 'neutral';
    trendValue: string;
  }> = [
    {
      title: 'Monthly Income',
      value: formatCurrency(summary.monthlyIncome),
      icon: <AttachMoney fontSize="large" />, 
      trend: 'up',
      trendValue: '+12.5%'
    },
    {
      title: 'Monthly Expenses',
      value: formatCurrency(summary.monthlyExpenses),
      icon: <Receipt fontSize="large" />, 
      trend: 'down',
      trendValue: '-8.2%'
    },
    {
      title: 'Net Income',
      value: formatCurrency(summary.netIncome),
      icon: <Savings fontSize="large" />, 
      trend: summary.netIncome > 0 ? 'up' : 'down',
      trendValue: summary.netIncome > 0 ? '+15.3%' : '-5.2%'
    },
    {
      title: 'Total Transactions',
      value: summary.totalTransactions.toString(),
      icon: <CreditCard fontSize="large" />, 
      trend: 'neutral',
      trendValue: ''
    }
  ];

  return (
    <>
      {cards.map(card => (
        <StatCard
          key={card.title}
          title={card.title}
          value={card.value}
          icon={card.icon}
          trend={card.trend}
          trendValue={card.trendValue}
        />
      ))}
    </>
  );
};

export default StatCards;
