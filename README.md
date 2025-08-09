# Finance Tracker App

A modern, AI-powered finance tracker built with Next.js, TypeScript, and Chart.js.

## Features

- ✅ **Expense Tracking**: Add, view, and delete expenses with categories
- 📊 **Visual Analytics**: Interactive charts showing spending patterns
- 🧠 **AI Insights**: Get personalized financial advice using OpenAI GPT
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- 💾 **Local Storage**: Data persists in your browser

## Tech Stack

- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Charts**: Chart.js + React Chart.js 2
- **AI**: OpenAI GPT-3.5-turbo
- **Icons**: Lucide React
- **Storage**: Browser localStorage

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key (optional, for AI insights)

### Installation

1. **Clone and navigate to the project**:
   ```bash
   cd finance-tracker-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Copy `.env.local` file
   - Add your OpenAI API key:
     ```
     OPENAI_API_KEY=your_actual_api_key_here
     ```
   - Get your API key from: https://platform.openai.com/api-keys

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Adding Expenses
1. Fill out the expense form with:
   - Amount (in USD)
   - Category (Food, Transportation, etc.)
   - Description
   - Date
2. Click "Add Expense" to save

### Viewing Analytics
- **Summary Cards**: See total expenses, monthly spending, and trends
- **Charts**: View spending by category (pie chart) and monthly trends (bar chart)
- **Expense List**: Browse all expenses with ability to delete

### AI Insights
1. Add some expenses first
2. Click "Get AI Insights" in the right sidebar
3. Receive personalized financial advice and spending analysis

## Project Structure

```
finance-tracker-app/
├── app/
│   ├── analytics/                  # Analytics page with Chart.js
│   ├── api/                       # API routes
│   │   ├── ai-insights/route.ts   # OpenAI API integration
│   │   ├── budgets/route.ts       # Budget management API
│   │   ├── categories/route.ts    # Categories API
│   │   ├── dashboard/route.ts     # Dashboard data API
│   │   ├── recurring/route.ts     # Recurring bills API
│   │   └── transactions/route.ts  # Transactions API
│   ├── budgets/                   # Budget management page
│   ├── dashboard/                 # Main dashboard
│   ├── recurring/                 # Recurring bills page
│   ├── reports/                   # Financial reports page
│   ├── settings/                  # Settings page
│   ├── transactions/              # Transactions page
│   ├── globals.css                # Global styles
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Landing page
├── components/
│   ├── charts/
│   │   └── ExpenseCharts.tsx      # Chart.js visualizations
│   ├── forms/
│   │   └── MUIExpenseForm.tsx     # Material-UI expense form
│   ├── tables/
│   │   └── ExpenseReports.tsx     # Data table components
│   └── ui/
│       ├── Header.tsx             # Navigation header
│       ├── Layout.tsx             # Page layout wrapper
│       ├── MUIThemeProvider.tsx   # Material-UI theme
│       └── Sidebar.tsx            # Navigation sidebar
├── lib/
│   └── prisma.ts                  # Prisma client configuration
├── prisma/
│   ├── schema.prisma              # Database schema
│   └── seed.ts                    # Database seed data
├── types/
│   ├── expense.ts                 # TypeScript interfaces
│   └── index.ts                   # Type exports
└── ...config files
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for AI insights | Optional |

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Features in Detail

### Expense Categories
- Food & Dining
- Transportation
- Shopping
- Entertainment
- Bills & Utilities
- Healthcare
- Travel
- Education
- Other

### AI Insights Features
- Spending pattern analysis
- Category breakdown insights
- Monthly comparison trends
- Personalized saving suggestions
- Financial health assessment

## Next Steps

Want to enhance the app? Consider adding:
- 🏦 Bank account integration
- 📅 Budget planning and goals
- 📧 Email/SMS expense reminders
- 🔄 Data export/import (CSV, JSON)
- 👥 Multi-user support
- 🎯 Expense predictions
- 📊 More chart types and filters

## Troubleshooting

### Common Issues

1. **AI Insights not working**: 
   - Check if OPENAI_API_KEY is set correctly
   - Ensure you have OpenAI credits

2. **Charts not rendering**:
   - Check browser console for errors
   - Ensure Chart.js dependencies are installed

3. **Data not persisting**:
   - Check if localStorage is enabled in browser
   - Try clearing browser cache

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
