import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Create test users
  const users = [
    {
      id: 'user-1',
      email: 'john.doe@example.com',
      name: 'John Doe',
    },
    {
      id: 'user-2',
      email: 'jane.smith@example.com',
      name: 'Jane Smith',
    },
    {
      id: 'user-3',
      email: 'mike.johnson@example.com',
      name: 'Mike Johnson',
    },
  ];

  console.log('Creating users...');
  for (const userData of users) {
    await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: userData,
    });
  }

  // Create categories for each user
  const categoryData = [
    { name: 'Food & Dining', icon: '🍽️', color: '#FF6B6B', description: 'Restaurants, groceries, and food delivery' },
    { name: 'Transportation', icon: '🚗', color: '#4ECDC4', description: 'Gas, public transport, car maintenance' },
    { name: 'Shopping', icon: '🛍️', color: '#45B7D1', description: 'Clothing, electronics, and general shopping' },
    { name: 'Entertainment', icon: '🎬', color: '#96CEB4', description: 'Movies, games, subscriptions' },
    { name: 'Bills & Utilities', icon: '📄', color: '#FFEAA7', description: 'Rent, electricity, internet, phone' },
    { name: 'Healthcare', icon: '🏥', color: '#DDA0DD', description: 'Medical expenses, pharmacy, insurance' },
    { name: 'Travel', icon: '✈️', color: '#FD79A8', description: 'Flights, hotels, vacation expenses' },
    { name: 'Education', icon: '📚', color: '#6C5CE7', description: 'Books, courses, learning materials' },
    { name: 'Salary', icon: '💰', color: '#00B894', description: 'Monthly salary and bonuses' },
    { name: 'Freelance', icon: '💻', color: '#00CEC9', description: 'Freelance work and side projects' },
    { name: 'Investments', icon: '📈', color: '#FDCB6E', description: 'Investment returns and dividends' },
    { name: 'Other Income', icon: '💸', color: '#A29BFE', description: 'Other sources of income' },
  ];

  console.log('Creating categories...');
  for (const user of users) {
    for (const category of categoryData) {
      await prisma.category.upsert({
        where: {
          name_userId: {
            name: category.name,
            userId: user.id,
          },
        },
        update: {},
        create: {
          ...category,
          userId: user.id,
        },
      });
    }
  }

  // Get created categories for transactions
  const allCategories = await prisma.category.findMany();
  const user1Categories = allCategories.filter(c => c.userId === 'user-1');
  const user2Categories = allCategories.filter(c => c.userId === 'user-2');
  const user3Categories = allCategories.filter(c => c.userId === 'user-3');

  // Helper function to get random date within last 6 months
  const getRandomDate = () => {
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 6);
    return new Date(sixMonthsAgo.getTime() + Math.random() * (now.getTime() - sixMonthsAgo.getTime()));
  };

  // Sample transactions for User 1 (John Doe)
  const user1Transactions = [
    // Income transactions
    { amount: 5000, description: 'Monthly Salary - January', type: 'INCOME', category: 'Salary', date: new Date('2025-01-15') },
    { amount: 5000, description: 'Monthly Salary - February', type: 'INCOME', category: 'Salary', date: new Date('2025-02-15') },
    { amount: 5000, description: 'Monthly Salary - March', type: 'INCOME', category: 'Salary', date: new Date('2025-03-15') },
    { amount: 1200, description: 'Freelance Project - Web Development', type: 'INCOME', category: 'Freelance', date: new Date('2025-02-28') },
    { amount: 800, description: 'Stock Dividends', type: 'INCOME', category: 'Investments', date: new Date('2025-03-10') },
    
    // Expense transactions
    { amount: 1200, description: 'Monthly Rent', type: 'EXPENSE', category: 'Bills & Utilities', date: new Date('2025-01-01') },
    { amount: 1200, description: 'Monthly Rent', type: 'EXPENSE', category: 'Bills & Utilities', date: new Date('2025-02-01') },
    { amount: 1200, description: 'Monthly Rent', type: 'EXPENSE', category: 'Bills & Utilities', date: new Date('2025-03-01') },
    { amount: 450, description: 'Grocery Shopping - Whole Foods', type: 'EXPENSE', category: 'Food & Dining', merchant: 'Whole Foods Market' },
    { amount: 85, description: 'Gas Station Fill-up', type: 'EXPENSE', category: 'Transportation', merchant: 'Shell' },
    { amount: 35, description: 'Netflix Subscription', type: 'EXPENSE', category: 'Entertainment', merchant: 'Netflix' },
    { amount: 120, description: 'Electric Bill', type: 'EXPENSE', category: 'Bills & Utilities', merchant: 'ConEd' },
    { amount: 65, description: 'Internet Bill', type: 'EXPENSE', category: 'Bills & Utilities', merchant: 'Verizon' },
    { amount: 250, description: 'New Running Shoes', type: 'EXPENSE', category: 'Shopping', merchant: 'Nike' },
    { amount: 45, description: 'Dinner at Italian Restaurant', type: 'EXPENSE', category: 'Food & Dining', merchant: 'Olive Garden' },
    { amount: 12, description: 'Coffee and Pastry', type: 'EXPENSE', category: 'Food & Dining', merchant: 'Starbucks' },
    { amount: 180, description: 'Car Insurance Premium', type: 'EXPENSE', category: 'Transportation', merchant: 'Geico' },
    { amount: 75, description: 'Gym Membership', type: 'EXPENSE', category: 'Healthcare', merchant: 'Planet Fitness' },
    { amount: 25, description: 'Movie Tickets', type: 'EXPENSE', category: 'Entertainment', merchant: 'AMC Theaters' },
    { amount: 320, description: 'Groceries for the Week', type: 'EXPENSE', category: 'Food & Dining', merchant: 'Safeway' },
  ];

  // Sample transactions for User 2 (Jane Smith)
  const user2Transactions = [
    // Income
    { amount: 4200, description: 'Monthly Salary - January', type: 'INCOME', category: 'Salary', date: new Date('2025-01-15') },
    { amount: 4200, description: 'Monthly Salary - February', type: 'INCOME', category: 'Salary', date: new Date('2025-02-15') },
    { amount: 4200, description: 'Monthly Salary - March', type: 'INCOME', category: 'Salary', date: new Date('2025-03-15') },
    { amount: 600, description: 'Consulting Work', type: 'INCOME', category: 'Freelance', date: new Date('2025-01-20') },
    
    // Expenses
    { amount: 950, description: 'Apartment Rent', type: 'EXPENSE', category: 'Bills & Utilities', date: new Date('2025-01-01') },
    { amount: 950, description: 'Apartment Rent', type: 'EXPENSE', category: 'Bills & Utilities', date: new Date('2025-02-01') },
    { amount: 950, description: 'Apartment Rent', type: 'EXPENSE', category: 'Bills & Utilities', date: new Date('2025-03-01') },
    { amount: 380, description: 'Weekly Grocery Shopping', type: 'EXPENSE', category: 'Food & Dining', merchant: 'Trader Joes' },
    { amount: 55, description: 'Uber Ride to Airport', type: 'EXPENSE', category: 'Transportation', merchant: 'Uber' },
    { amount: 15, description: 'Spotify Premium', type: 'EXPENSE', category: 'Entertainment', merchant: 'Spotify' },
    { amount: 200, description: 'New Dress for Event', type: 'EXPENSE', category: 'Shopping', merchant: 'Zara' },
    { amount: 80, description: 'Dinner with Friends', type: 'EXPENSE', category: 'Food & Dining', merchant: 'The Cheesecake Factory' },
    { amount: 120, description: 'Yoga Classes Package', type: 'EXPENSE', category: 'Healthcare', merchant: 'YogaWorks' },
    { amount: 45, description: 'Phone Bill', type: 'EXPENSE', category: 'Bills & Utilities', merchant: 'T-Mobile' },
    { amount: 90, description: 'Gas for Road Trip', type: 'EXPENSE', category: 'Transportation', merchant: 'Chevron' },
  ];

  // Sample transactions for User 3 (Mike Johnson)
  const user3Transactions = [
    // Income
    { amount: 6500, description: 'Monthly Salary - January', type: 'INCOME', category: 'Salary', date: new Date('2025-01-15') },
    { amount: 6500, description: 'Monthly Salary - February', type: 'INCOME', category: 'Salary', date: new Date('2025-02-15') },
    { amount: 6500, description: 'Monthly Salary - March', type: 'INCOME', category: 'Salary', date: new Date('2025-03-15') },
    { amount: 2000, description: 'Bonus Payment', type: 'INCOME', category: 'Salary', date: new Date('2025-02-28') },
    
    // Expenses
    { amount: 1800, description: 'Mortgage Payment', type: 'EXPENSE', category: 'Bills & Utilities', date: new Date('2025-01-01') },
    { amount: 1800, description: 'Mortgage Payment', type: 'EXPENSE', category: 'Bills & Utilities', date: new Date('2025-02-01') },
    { amount: 1800, description: 'Mortgage Payment', type: 'EXPENSE', category: 'Bills & Utilities', date: new Date('2025-03-01') },
    { amount: 650, description: 'Family Grocery Shopping', type: 'EXPENSE', category: 'Food & Dining', merchant: 'Costco' },
    { amount: 120, description: 'Gas Station Fill-up', type: 'EXPENSE', category: 'Transportation', merchant: 'Exxon' },
    { amount: 150, description: 'Family Dinner Out', type: 'EXPENSE', category: 'Food & Dining', merchant: 'Red Lobster' },
    { amount: 300, description: 'Kids Clothing', type: 'EXPENSE', category: 'Shopping', merchant: 'Target' },
    { amount: 200, description: 'Pediatrician Visit', type: 'EXPENSE', category: 'Healthcare', merchant: 'Children\'s Medical Center' },
    { amount: 450, description: 'Flight Tickets for Vacation', type: 'EXPENSE', category: 'Travel', merchant: 'Delta Airlines' },
    { amount: 180, description: 'Electricity Bill', type: 'EXPENSE', category: 'Bills & Utilities', merchant: 'Pacific Gas & Electric' },
    { amount: 95, description: 'Cable & Internet', type: 'EXPENSE', category: 'Bills & Utilities', merchant: 'Comcast' },
  ];

  console.log('Creating transactions...');
  
  // Create transactions for User 1
  for (const transaction of user1Transactions) {
    const category = user1Categories.find(c => c.name === transaction.category);
    if (category) {
      await prisma.transaction.create({
        data: {
          amount: transaction.amount,
          description: transaction.description,
          type: transaction.type as 'INCOME' | 'EXPENSE',
          date: transaction.date || getRandomDate(),
          status: 'APPROVED',
          merchant: transaction.merchant,
          userId: 'user-1',
          categoryId: category.id,
        },
      });
    }
  }

  // Create transactions for User 2
  for (const transaction of user2Transactions) {
    const category = user2Categories.find(c => c.name === transaction.category);
    if (category) {
      await prisma.transaction.create({
        data: {
          amount: transaction.amount,
          description: transaction.description,
          type: transaction.type as 'INCOME' | 'EXPENSE',
          date: transaction.date || getRandomDate(),
          status: 'APPROVED',
          merchant: transaction.merchant,
          userId: 'user-2',
          categoryId: category.id,
        },
      });
    }
  }

  // Create transactions for User 3
  for (const transaction of user3Transactions) {
    const category = user3Categories.find(c => c.name === transaction.category);
    if (category) {
      await prisma.transaction.create({
        data: {
          amount: transaction.amount,
          description: transaction.description,
          type: transaction.type as 'INCOME' | 'EXPENSE',
          date: transaction.date || getRandomDate(),
          status: 'APPROVED',
          merchant: transaction.merchant,
          userId: 'user-3',
          categoryId: category.id,
        },
      });
    }
  }

  // Create budgets
  console.log('Creating budgets...');
  
  const budgets = [
    // User 1 budgets
    {
      name: 'Monthly Food Budget',
      amount: 800,
      spent: 465,
      period: 'MONTHLY',
      startDate: new Date('2025-03-01'),
      endDate: new Date('2025-03-31'),
      userId: 'user-1',
      categoryName: 'Food & Dining',
    },
    {
      name: 'Transportation Budget',
      amount: 300,
      spent: 265,
      period: 'MONTHLY',
      startDate: new Date('2025-03-01'),
      endDate: new Date('2025-03-31'),
      userId: 'user-1',
      categoryName: 'Transportation',
    },
    {
      name: 'Entertainment Budget',
      amount: 150,
      spent: 60,
      period: 'MONTHLY',
      startDate: new Date('2025-03-01'),
      endDate: new Date('2025-03-31'),
      userId: 'user-1',
      categoryName: 'Entertainment',
    },
    
    // User 2 budgets
    {
      name: 'Monthly Groceries',
      amount: 600,
      spent: 380,
      period: 'MONTHLY',
      startDate: new Date('2025-03-01'),
      endDate: new Date('2025-03-31'),
      userId: 'user-2',
      categoryName: 'Food & Dining',
    },
    {
      name: 'Shopping Budget',
      amount: 400,
      spent: 200,
      period: 'MONTHLY',
      startDate: new Date('2025-03-01'),
      endDate: new Date('2025-03-31'),
      userId: 'user-2',
      categoryName: 'Shopping',
    },
    
    // User 3 budgets
    {
      name: 'Family Food Budget',
      amount: 1200,
      spent: 800,
      period: 'MONTHLY',
      startDate: new Date('2025-03-01'),
      endDate: new Date('2025-03-31'),
      userId: 'user-3',
      categoryName: 'Food & Dining',
    },
    {
      name: 'Travel Fund',
      amount: 2000,
      spent: 450,
      period: 'QUARTERLY',
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-03-31'),
      userId: 'user-3',
      categoryName: 'Travel',
    },
  ];

  for (const budget of budgets) {
    const category = allCategories.find(c => c.name === budget.categoryName && c.userId === budget.userId);
    if (category) {
      await prisma.budget.create({
        data: {
          name: budget.name,
          amount: budget.amount,
          spent: budget.spent,
          period: budget.period as 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY',
          startDate: budget.startDate,
          endDate: budget.endDate,
          userId: budget.userId,
          categoryId: category.id,
        },
      });
    }
  }

  console.log('Database seeding completed successfully!');
  console.log('Created:');
  console.log('- 3 users');
  console.log('- 12 categories per user (36 total)');
  console.log('- Sample transactions for each user');
  console.log('- Budget plans for each user');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
