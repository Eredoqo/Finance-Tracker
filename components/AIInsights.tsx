'use client';

import { useState } from 'react';
import { Expense } from '@/types/expense';
import { Brain, Loader2 } from 'lucide-react';

interface AIInsightsProps {
  expenses: Expense[];
}

export default function AIInsights({ expenses }: AIInsightsProps) {
  const [insights, setInsights] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const generateInsights = async () => {
    if (expenses.length === 0) {
      setError('Add some expenses first to get AI insights.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/ai-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ expenses }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate insights');
      }

      setInsights(data.insight);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate insights');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <Brain className="mr-2" size={24} />
          AI Insights
        </h2>
        <button
          onClick={generateInsights}
          disabled={loading || expenses.length === 0}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 animate-spin" size={16} />
              Analyzing...
            </>
          ) : (
            'Get AI Insights'
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {insights && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Your Financial Insights:</h3>
          <div className="text-blue-800 whitespace-pre-line">
            {insights}
          </div>
        </div>
      )}

      {!insights && !error && !loading && (
        <div className="text-gray-500 text-center py-8">
          <Brain size={48} className="mx-auto mb-4 text-gray-300" />
          <p>Click &quot;Get AI Insights&quot; to analyze your spending patterns and get personalized financial advice.</p>
          {expenses.length === 0 && (
            <p className="text-sm mt-2">Add some expenses first to get started!</p>
          )}
        </div>
      )}
    </div>
  );
}
