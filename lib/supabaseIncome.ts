import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function addIncomeAndNotify({ user_id, amount, email }: { user_id: string, amount: number, email: string }) {
  // 1. Insert income (assuming you have an incomes table)
  const { error: incomeError } = await supabase
    .from('incomes')
    .insert([{ user_id, amount }]);

  // 2. Insert notification
  const { error: notifError } = await supabase
    .from('notifications')
    .insert([{ user_id, message: `You entered a new income: $${amount}` }]);

  // 3. Send email via Edge Function (recommended) or third-party API
  await fetch('https://<your-project>.functions.supabase.co/send-income-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, amount }),
  });

  return {
    success: !incomeError && !notifError,
    incomeError,
    notifError,
  };
}
