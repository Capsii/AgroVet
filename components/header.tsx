'use client';

import Link from 'next/link';
import { Leaf } from 'lucide-react';
import { LanguageSwitcher } from './language-switcher';
import { useLanguage } from '@/contexts/language-context';
import { getTranslation } from '@/lib/translations';

export function Header() {
  const { language } = useLanguage();

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-lg bg-primary text-primary-foreground group-hover:shadow-lg transition-shadow">
              <Leaf size={24} />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-foreground">AgroVet</h1>
              <p className="text-xs text-muted-foreground">Cattle Health Guide</p>
            </div>
          </Link>
          <nav className="flex items-center gap-2 sm:gap-4">
            <LanguageSwitcher />
            <Link href="/login" className="text-foreground hover:text-primary transition-colors text-sm sm:text-base">
              {getTranslation(language, 'header.login')}
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:shadow-lg transition-shadow text-sm sm:text-base"
            >
              {getTranslation(language, 'header.register')}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
