import React from "react"
import { Sidebar } from '@/components/sidebar';
import Link from 'next/link';
import { Leaf } from 'lucide-react';

// Force dynamic rendering for all diagnosis pages
export const dynamic = 'force-dynamic';

export default function DiagnosisLayout({

  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="sticky top-0 z-40 bg-transparent border-b border-border lg:hidden">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                <Leaf size={20} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">AgroVet</h1>
              </div>
            </Link>
          </div>
        </div>
      </header>
      <div className="lg:ml-64">
        <Sidebar />
        {children}
      </div>
    </>
  );
}
