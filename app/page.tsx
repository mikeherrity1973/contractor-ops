'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ENV } from '@/lib/env';
import { supabase } from '@/lib/supabaseClient';
import { Button, Card, Input } from '@/components/ui';

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const mode = ENV.AUTH_MODE;

  useEffect(() => {
    if (mode !== 'demo_pin') {
      supabase.auth.getSession().then(({ data }) => {
        if (data.session) router.replace('/app');
      });
    } else {
      const ok = typeof window !== 'undefined' && localStorage.getItem('demo_ok') === 'yes';
      if (ok) router.replace('/app');
    }
  }, [router, mode]);

  async function loginPassword() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) alert(error.message); else router.replace('/app');
  }

  async function loginMagic() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${ENV.APP_URL}/app` } });
    setLoading(false);
    if (error) alert(error.message); else alert('Check your email for the sign-in link.');
  }

  function loginDemo() {
    if (pin === ENV.DEMO_PIN) { localStorage.setItem('demo_ok', 'yes'); router.replace('/app'); }
    else alert('Wrong PIN');
  }

  return (
    <div className="mx-auto max-w-md p-6 mt-12">
      <Card title="Contractor Ops — Sign in" subtitle={`Mode: ${mode}`}>
        {mode === 'password' && (
          <form className="space-y-3" onSubmit={e => { e.preventDefault(); loginPassword(); }}>
            <Input value={email} onChange={setEmail} placeholder="Email" />
            <Input value={password} onChange={setPassword} placeholder="Password" type="password" />
            <div className="flex gap-2 justify-end">
              <Button type="submit" disabled={loading}>Sign in</Button>
            </div>
          </form>
        )}
        {mode === 'magic_link' && (
          <div className="space-y-3">
            <Input value={email} onChange={setEmail} placeholder="Email for magic link" />
            <div className="flex gap-2 justify-end">
              <Button onClick={loginMagic} disabled={loading}>Send magic link</Button>
            </div>
          </div>
        )}
        {mode === 'demo_pin' && (
          <div className="space-y-3">
            <Input value={pin} onChange={setPin} placeholder="Enter demo PIN" />
            <div className="flex gap-2 justify-end">
              <Button onClick={loginDemo}>Enter</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
