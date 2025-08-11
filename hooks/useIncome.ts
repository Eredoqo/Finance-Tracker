import { useState, useEffect } from 'react'
import { Income, CreateIncomeRequest, UpdateIncomeRequest, IncomeResponse } from '@/types/income'

export function useIncome(token: string | null) {
  const [income, setIncome] = useState<Income[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 50,
    totalPages: 0
  })
  const [summary, setSummary] = useState({
    totalAmount: 0,
    count: 0
  })

  // Fetch income records
  const fetchIncome = async (page = 1, limit = 50) => {
    if (!token) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/income?page=${page}&limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch income')
      }

      const data: IncomeResponse = await response.json()
      setIncome(data.income)
      setPagination(data.pagination)
      setSummary(data.summary)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch income')
      console.error('Error fetching income:', err)
    } finally {
      setLoading(false)
    }
  }

  // Create new income record
  const createIncome = async (incomeData: CreateIncomeRequest) => {
    if (!token) throw new Error('No authentication token')

    try {
      const response = await fetch('/api/income', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(incomeData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create income')
      }

      const { income: newIncome } = await response.json()
      // Add new income to the beginning of the list
      setIncome(prev => [newIncome, ...prev])
      // Update summary
      setSummary(prev => ({
        totalAmount: prev.totalAmount + newIncome.amount,
        count: prev.count + 1
      }))
      return newIncome
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create income')
      throw err
    }
  }

  // Update income record
  const updateIncome = async (incomeData: UpdateIncomeRequest) => {
    if (!token) throw new Error('No authentication token')

    try {
      const response = await fetch('/api/income', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(incomeData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update income')
      }

      const { income: updatedIncome } = await response.json()
      // Update income in the list
      setIncome(prev => 
        prev.map(item => 
          item.id === updatedIncome.id ? updatedIncome : item
        )
      )
      // Recalculate summary
      const newTotal = income.reduce((sum, item) => 
        item.id === updatedIncome.id ? sum + updatedIncome.amount : sum + item.amount, 0
      )
      setSummary(prev => ({
        ...prev,
        totalAmount: newTotal
      }))
      return updatedIncome
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update income')
      throw err
    }
  }

  // Delete income record
  const deleteIncome = async (incomeId: string) => {
    if (!token) throw new Error('No authentication token')

    try {
      const response = await fetch(`/api/income?id=${incomeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete income')
      }

      // Find the income to delete for summary update
      const incomeToDelete = income.find(item => item.id === incomeId)
      // Remove income from the list
      setIncome(prev => prev.filter(item => item.id !== incomeId))
      // Update summary
      if (incomeToDelete) {
        setSummary(prev => ({
          totalAmount: prev.totalAmount - incomeToDelete.amount,
          count: prev.count - 1
        }))
      }
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete income')
      throw err
    }
  }

  // Get income by ID
  const getIncomeById = (incomeId: string) => {
    return income.find(item => item.id === incomeId)
  }

  // Get income for a specific period
  const getIncomeByPeriod = (startDate: Date, endDate: Date) => {
    return income.filter(item => {
      const incomeDate = new Date(item.date)
      return incomeDate >= startDate && incomeDate <= endDate
    })
  }

  // Get monthly income totals
  const getMonthlyTotals = () => {
    const monthlyData: { [key: string]: number } = {}
    income.forEach(item => {
      const date = new Date(item.date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + item.amount
    })
    return monthlyData
  }

  // Get income by source
  const getIncomeBySource = () => {
    const sourceData: { [key: string]: number } = {}
    income.forEach(item => {
      const source = item.source || 'Unknown'
      sourceData[source] = (sourceData[source] || 0) + item.amount
    })
    return sourceData
  }

  // Fetch income on mount and token change
  useEffect(() => {
    if (token) {
      fetchIncome()
    } else {
      setIncome([])
      setPagination({ total: 0, page: 1, limit: 50, totalPages: 0 })
      setSummary({ totalAmount: 0, count: 0 })
      setLoading(false)
    }
  }, [token])

  return {
    income,
    loading,
    error,
    pagination,
    summary,
    fetchIncome,
    createIncome,
    updateIncome,
    deleteIncome,
    getIncomeById,
    getIncomeByPeriod,
    getMonthlyTotals,
    getIncomeBySource,
    refresh: () => fetchIncome(pagination.page, pagination.limit)
  }
}
