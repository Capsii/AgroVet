'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Leaf,
  Activity,
  ImageIcon,
  MapPin,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  ShoppingCart,
} from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';

const navItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    label: 'Symptom Diagnosis',
    href: '/diagnosis/symptoms',
    icon: Activity,
  },
  {
    label: 'Image Diagnosis',
    href: '/diagnosis/image',
    icon: ImageIcon,
  },
  {
    label: 'Identify Hospitals',
    href: '/hospitals',
    icon: MapPin,
  },
  {
    label: 'Medicine Store',
    href: '/medicines',
    icon: ShoppingCart,
  },
  {
    label: 'My Profile',
    href: '/profile',
    icon: User,
  },
];

const adminItems = [
  {
    label: 'Admin Panel',
    href: '/admin',
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <Button
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full shadow-lg"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-card border-r border-border z-30 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="p-6 space-y-8 h-full overflow-y-auto flex flex-col">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary text-primary-foreground">
              <Leaf size={20} />
            </div>
            <div>
              <p className="font-bold text-foreground">AgroVet</p>
              <p className="text-xs text-muted-foreground">Farmer Portal</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2 flex-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-4">
              Main Menu
            </p>
            {navItems.map(item => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${active
                    ? 'bg-primary text-primary-foreground font-medium'
                    : 'text-foreground hover:bg-muted text-muted-foreground'
                    }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Admin Items */}
            <div className="pt-6 border-t border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-4">
                Administration
              </p>
              {adminItems.map(item => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${active
                      ? 'bg-primary text-primary-foreground font-medium'
                      : 'text-foreground hover:bg-muted text-muted-foreground'
                      }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Logout */}
          <div className="pt-6 border-t border-border">
            <Button
              variant="outline"
              className="w-full gap-2 justify-start bg-transparent"
              onClick={async () => {
                await signOut();
                setIsOpen(false);
                router.push('/login');
              }}
            >
              <LogOut size={20} />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
