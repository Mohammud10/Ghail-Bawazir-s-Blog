import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Settings,
  Mail,
  Scale,
  LogOut,
  Calculator,
} from 'lucide-react';
import React from 'react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await auth();

  // Route protection fallback
  if (!session?.user) {
    redirect('/admin/login');
  }

  const sidebarLinks = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/messages', label: 'Messages', icon: Mail },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar Desktop */}
      <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col justify-between border-e border-slate-800">
        <div>
          {/* Brand header */}
          <div className="h-16 flex items-center gap-2 px-6 border-b border-slate-800 bg-slate-950">
            <Calculator className="h-6 w-6 text-primary" />
            <span className="font-extrabold text-lg tracking-tight text-white">Admin Panel</span>
          </div>

          {/* Links navigation */}
          <nav className="p-4 space-y-1">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  <Icon className="h-4.5 w-4.5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User profile footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs font-bold truncate text-white">{session.user.name || 'Admin User'}</p>
            <p className="text-[10px] truncate text-slate-500">{session.user.email}</p>
          </div>
          <Link
            href="/api/auth/signout"
            title="Sign Out"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <LogOut className="h-4 w-4" />
          </Link>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Navbar */}
        <header className="h-16 border-b border-border bg-surface flex items-center justify-between px-6 md:px-8">
          <h2 className="text-sm font-semibold text-text-muted">Welcome back, {session.user.name}</h2>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-hover border border-primary/20 hover:bg-primary-light px-3 py-1.5 rounded-md transition"
          >
            <Scale className="h-3.5 w-3.5" />
            <span>View Website</span>
          </Link>
        </header>

        {/* Scrollable pane */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
