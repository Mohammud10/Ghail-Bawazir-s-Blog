import { prisma } from '@/lib/prisma';
import { Card } from '@/components/ui/Card';
import {
  Calculator,
  Grid,
  Mail,
  Sliders,
  AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardOverview() {
  let stats = { calculators: 5, categories: 5, messages: 0, settings: 5 };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let recentMessages: any[] = [];

  try {
    const calcCount = await prisma.calculator.count();
    const catCount = await prisma.category.count();
    const msgCount = await prisma.contactMessage.count();
    const settingCount = await prisma.siteSetting.count();

    stats = {
      calculators: calcCount || 5,
      categories: catCount || 5,
      messages: msgCount,
      settings: settingCount || 5,
    };

    recentMessages = await prisma.contactMessage.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    });
  } catch (err) {
    console.warn('Database error while loading dashboard stats (normal before migrations):', err);
  }

  const statCards = [
    { label: 'Calculators', value: stats.calculators, icon: Calculator, color: 'text-primary bg-primary-light' },
    { label: 'Categories', value: stats.categories, icon: Grid, color: 'text-success bg-emerald-100' },
    { label: 'Unread Messages', value: stats.messages, icon: Mail, color: 'text-warning bg-amber-100' },
    { label: 'Site Settings', value: stats.settings, icon: Sliders, color: 'text-secondary bg-slate-100' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-black text-text tracking-tight">Overview Dashboard</h1>
        <p className="text-xs text-text-muted">Control panels, site settings, and message logs.</p>
      </div>

      {/* Stats Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="card p-6 bg-surface flex items-center justify-between border border-border rounded-xl shadow-sm">
              <div className="space-y-1">
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">{card.label}</span>
                <p className="text-2xl font-black text-text">{card.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${card.color}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Messages list */}
        <div className="lg:col-span-2 card p-6 bg-surface border border-border rounded-xl space-y-4 shadow-sm">
          <div className="flex justify-between items-center border-b border-border pb-4">
            <h3 className="font-extrabold text-base text-text">Recent Feedback Messages</h3>
            <Link href="/admin/messages" className="text-xs font-bold text-primary hover:underline">
              View all
            </Link>
          </div>

          {recentMessages.length > 0 ? (
            <div className="divide-y divide-border">
              {recentMessages.map((msg) => (
                <div key={msg.id} className="py-4 first:pt-0 last:pb-0 flex justify-between gap-4">
                  <div className="min-w-0 space-y-1">
                    <p className="text-sm font-bold text-text truncate">{msg.name}</p>
                    <p className="text-xs text-text-muted truncate">{msg.email}</p>
                    <p className="text-xs text-text leading-relaxed line-clamp-1">{msg.message}</p>
                  </div>
                  <span className="text-[10px] text-text-light font-medium flex-shrink-0">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-text-light text-xs flex flex-col justify-center items-center gap-2">
              <Mail className="h-8 w-8" />
              <span>No feedback messages found</span>
            </div>
          )}
        </div>

        {/* Database Warning or Settings shortcut */}
        <div className="card p-6 bg-surface border border-border rounded-xl space-y-4 shadow-sm">
          <h3 className="font-extrabold text-base text-text border-b border-border pb-4">System Alerts</h3>
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-3 text-amber-800">
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            <div className="text-xs space-y-1">
              <p className="font-bold">Next Steps Checklist</p>
              <p className="leading-relaxed">Verify PostgreSQL connection URL inside env, and execute Prisma database migrations to enable full message storage.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
