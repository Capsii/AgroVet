'use client';

import React from "react"
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Leaf, Mail, Lock } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { getTranslation } from '@/lib/translations';
import { useAuth } from '@/contexts/auth-context';

export default function LoginPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.email || !formData.password) {
        setError(getTranslation(language, 'login.error'));
        setLoading(false);
        return;
      }

      console.log('[v0] Starting login for:', formData.email);
      await signIn(formData.email, formData.password);
      console.log('[v0] Login successful, redirecting to dashboard');
      router.push('/dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : getTranslation(language, 'login.error');
      console.error('[v0] Login error:', errorMessage, err);
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-transparent page-enter">
      <Header />

      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <Card className="p-8 border border-border bg-card animate-scale-pop">
            <div className="flex justify-center mb-6">
              <div className="p-3 rounded-lg bg-primary text-primary-foreground animate-bounce-in animate-pulse-glow">
                <Leaf size={32} />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-foreground text-center mb-2 animate-fade-up delay-100">
              {getTranslation(language, 'login.title')}
            </h1>
            <p className="text-muted-foreground text-center mb-6">
              {getTranslation(language, 'login.subtitle')}
            </p>

            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex gap-3">
                <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-foreground font-medium">
                  {getTranslation(language, 'login.email')}
                </Label>
                <div className="relative mt-2">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 h-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="text-foreground font-medium">
                  {getTranslation(language, 'login.password')}
                </Label>
                <div className="relative mt-2">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 h-10"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-10 hover-scale"
                disabled={loading}
              >
                {loading ? getTranslation(language, 'login.signing') : getTranslation(language, 'login.signIn')}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground text-sm">
                {getTranslation(language, 'login.noAccount')}{' '}
                <Link href="/register" className="text-primary font-semibold hover:underline">
                  {getTranslation(language, 'login.register')}
                </Link>
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                {getTranslation(language, 'login.demo')}
              </p>
            </div>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
