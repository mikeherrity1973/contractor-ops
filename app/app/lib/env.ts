export const ENV = {
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  SUPABASE_ANON: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  AUTH_MODE: (process.env.NEXT_PUBLIC_AUTH_MODE || 'password') as 'password'|'magic_link'|'demo_pin',
  DEMO_PIN: process.env.NEXT_PUBLIC_DEMO_PIN || '2468',
};
