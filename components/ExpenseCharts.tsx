'use client';

import { Expense } from '@/types/expense';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface ExpenseChartsProps {
  expenses: Expense[];
}

export default function ExpenseCharts({ expenses }: ExpenseChartsProps) {
  const categoryData = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const pieChartData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        data: Object.values(categoryData),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384',
          '#C9CBCF',
          '#4BC0C0',
        ],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  // Monthly spending data
  const monthlyData = expenses.reduce((acc, expense) => {
    const month = new Date(expense.date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
    acc[month] = (acc[month] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const barChartData = {
    labels: Object.keys(monthlyData),
    datasets: [
      {
        label: 'Monthly Expenses',
        data: Object.values(monthlyData),
        backgroundColor: '#36A2EB',
        borderColor: '#36A2EB',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <h3 className="text-lg font-medium text-gray-600 mb-2">No data to display</h3>
        <p className="text-gray-500">Add some expenses to see your spending analytics.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Expenses by Category</h2>
        <div className="h-64">
          <Pie data={pieChartData} options={chartOptions} />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Monthly Spending</h2>
        <div className="h-64">
          <Bar data={barChartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}
