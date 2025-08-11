// lib/notifications.ts
import { PrismaClient, NotificationType, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

export class NotificationService {
  
  // Create a new notification
  static async createNotification(
    userId: string,
    title: string,
    message: string,
    type: NotificationType,
    metadata?: Prisma.InputJsonValue
  ) {
    try {
      const notification = await prisma.notification.create({
        data: {
          userId,
          title,
          message,
          type,
          metadata: metadata || {},
          isRead: false
        }
      })

      return { data: notification, error: null }
    } catch (error) {
      console.error('Error creating notification:', error)
      return { data: null, error }
    }
  }

  // Get all notifications for a user
  static async getUserNotifications(userId: string, limit = 50) {
    try {
      const notifications = await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit
      })

      return { data: notifications, error: null }
    } catch (error) {
      console.error('Error fetching notifications:', error)
      return { data: null, error }
    }
  }

  // Get unread notifications count
  static async getUnreadCount(userId: string) {
    try {
      const count = await prisma.notification.count({
        where: {
          userId,
          isRead: false
        }
      })

      return { count, error: null }
    } catch (error) {
      console.error('Error fetching unread count:', error)
      return { count: 0, error }
    }
  }

  // Mark notification as read
  static async markAsRead(notificationId: string) {
    try {
      const notification = await prisma.notification.update({
        where: { id: notificationId },
        data: { isRead: true }
      })

      return { data: notification, error: null }
    } catch (error) {
      console.error('Error marking notification as read:', error)
      return { data: null, error }
    }
  }

  // Mark all notifications as read for a user
  static async markAllAsRead(userId: string) {
    try {
      const result = await prisma.notification.updateMany({
        where: {
          userId,
          isRead: false
        },
        data: { isRead: true }
      })

      return { data: result, error: null }
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
      return { data: null, error }
    }
  }

  // Delete a notification
  static async deleteNotification(notificationId: string) {
    try {
      await prisma.notification.delete({
        where: { id: notificationId }
      })

      return { error: null }
    } catch (error) {
      console.error('Error deleting notification:', error)
      return { error }
    }
  }

  // Get or create notification preferences
  static async getNotificationPreferences(userId: string) {
    try {
      let preferences = await prisma.notificationPreference.findUnique({
        where: { userId }
      })

      // Create default preferences if they don't exist
      if (!preferences) {
        preferences = await prisma.notificationPreference.create({
          data: { userId }
        })
      }

      return { data: preferences, error: null }
    } catch (error) {
      console.error('Error fetching notification preferences:', error)
      return { data: null, error }
    }
  }

  // Update notification preferences
  static async updateNotificationPreferences(
    userId: string, 
    preferences: Partial<{
      budgetAlerts: boolean
      spendingWarnings: boolean
      goalNotifications: boolean
      paymentReminders: boolean
      emailNotifications: boolean
      pushNotifications: boolean
    }>
  ) {
    try {
      const updated = await prisma.notificationPreference.upsert({
        where: { userId },
        update: preferences,
        create: {
          userId,
          ...preferences
        }
      })

      return { data: updated, error: null }
    } catch (error) {
      console.error('Error updating notification preferences:', error)
      return { data: null, error }
    }
  }

  // Financial notification helpers
  static async createBudgetAlert(userId: string, budgetName: string, spent: number, budget: number) {
    // Check if user has budget alerts enabled
    const { data: preferences } = await this.getNotificationPreferences(userId)
    if (!preferences?.budgetAlerts) return { data: null, error: 'Budget alerts disabled' }

    const percentage = Math.round((spent / budget) * 100)
    const title = `Budget Alert: ${budgetName}`
    const message = `You've spent ${percentage}% of your ${budgetName} budget ($${spent.toFixed(2)} of $${budget.toFixed(2)})`
    
    return this.createNotification(userId, title, message, 'BUDGET_ALERT', {
      budgetName,
      spent,
      budget,
      percentage
    })
  }

  static async createSpendingWarning(userId: string, amount: number, description: string) {
    const { data: preferences } = await this.getNotificationPreferences(userId)
    if (!preferences?.spendingWarnings) return { data: null, error: 'Spending warnings disabled' }

    const title = 'Large Expense Detected'
    const message = `Unusual spending: $${amount.toFixed(2)} on ${description}`
    
    return this.createNotification(userId, title, message, 'SPENDING_WARNING', {
      amount,
      description
    })
  }

  static async createIncomeAdded(userId: string, amount: number, source: string) {
    const title = 'Income Added'
    const message = `New income of $${amount.toFixed(2)} from ${source} has been recorded`
    
    return this.createNotification(userId, title, message, 'INCOME_ADDED', {
      amount,
      source
    })
  }

  static async createTransactionApproved(userId: string, description: string, amount: number) {
    const title = 'Transaction Approved'
    const message = `Your transaction "${description}" for $${amount.toFixed(2)} has been approved`
    
    return this.createNotification(userId, title, message, 'TRANSACTION_APPROVED', {
      description,
      amount
    })
  }

  static async createBudgetExceeded(userId: string, budgetName: string, spent: number, budget: number) {
    const { data: preferences } = await this.getNotificationPreferences(userId)
    if (!preferences?.budgetAlerts) return { data: null, error: 'Budget alerts disabled' }

    const overspent = spent - budget
    const title = `Budget Exceeded: ${budgetName}`
    const message = `You've exceeded your ${budgetName} budget by $${overspent.toFixed(2)} ($${spent.toFixed(2)} of $${budget.toFixed(2)})`
    
    return this.createNotification(userId, title, message, 'BUDGET_EXCEEDED', {
      budgetName,
      spent,
      budget,
      overspent
    })
  }

  static async createMonthlySummary(userId: string, totalSpent: number, budgetTotal: number, topCategory: string) {
    const title = 'Monthly Summary'
    const message = `This month you spent $${totalSpent.toFixed(2)} of your $${budgetTotal.toFixed(2)} budget. Top category: ${topCategory}`
    
    return this.createNotification(userId, title, message, 'MONTHLY_SUMMARY', {
      totalSpent,
      budgetTotal,
      topCategory
    })
  }

  static async createGoalAchieved(userId: string, goalName: string, amount: number) {
    const { data: preferences } = await this.getNotificationPreferences(userId)
    if (!preferences?.goalNotifications) return { data: null, error: 'Goal notifications disabled' }

    const title = '🎉 Goal Achieved!'
    const message = `Congratulations! You've reached your ${goalName} goal of $${amount.toFixed(2)}`
    
    return this.createNotification(userId, title, message, 'GOAL_ACHIEVED', {
      goalName,
      amount
    })
  }

  static async createPaymentReminder(userId: string, description: string, amount: number, dueDate: string) {
    const { data: preferences } = await this.getNotificationPreferences(userId)
    if (!preferences?.paymentReminders) return { data: null, error: 'Payment reminders disabled' }

    const title = 'Payment Reminder'
    const message = `${description} payment of $${amount.toFixed(2)} is due on ${dueDate}`
    
    return this.createNotification(userId, title, message, 'PAYMENT_REMINDER', {
      description,
      amount,
      dueDate
    })
  }

  // Auto-trigger notifications based on income
  static async checkAndCreateIncomeNotifications(income: { userId: string; amount: number; source?: string }) {
    const { userId, amount, source } = income

    // Create income notification
    await this.createIncomeAdded(userId, amount, source || 'Unknown')

    // Check if income helps achieve any goals
    const currentMonth = new Date()
    currentMonth.setDate(1)
    currentMonth.setHours(0, 0, 0, 0)
    
    const nextMonth = new Date(currentMonth)
    nextMonth.setMonth(currentMonth.getMonth() + 1)

    try {
      const monthlyIncome = await prisma.income.aggregate({
        where: {
          userId,
          createdAt: {
            gte: currentMonth,
            lt: nextMonth
          }
        },
        _sum: { amount: true }
      })

  const totalMonthlyIncome = Number(monthlyIncome._sum.amount) || 0

      // If monthly income exceeds $5000, create goal achievement notification
      if (totalMonthlyIncome >= 5000) {
        // Check if we already notified about this goal this month
        const existingNotification = await prisma.notification.findFirst({
          where: {
            userId,
            type: 'GOAL_ACHIEVED',
            createdAt: {
              gte: currentMonth,
              lt: nextMonth
            }
          }
        })

        if (!existingNotification) {
          await this.createGoalAchieved(userId, 'Monthly Income', 5000)
        }
      }
    } catch (error) {
      console.error('Error checking income goals:', error)
    }
  }
}