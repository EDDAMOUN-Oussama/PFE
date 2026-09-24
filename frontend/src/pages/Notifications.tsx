import { useMemo, useState } from 'react';
import { useHealth } from '@/contexts/HealthContext';
import { localDate } from '@/lib/health';
import type { Goal } from '@/types/health';
import { Button } from '@/components/ui/button';
interface NoticeState { read?: boolean; dismissed?: boolean; snoozedUntil?: number; }
function Notices({ userId, goals }: { userId: string; goals: Goal[] }) {
  const key = `healthytrack:notifications:${userId}`;
  const [saved, setSaved] = useState<Record<string, NoticeState>>(() => { try { return JSON.parse(localStorage.getItem(key) || '{}'); } catch { return {}; } });
  const notices = useMemo(() => goals.flatMap(goal => {
    if (goal.progress >= 100) return [{ id: `complete:${goal.id}`, title: `Objectif atteint : ${goal.title}` }];
    if (goal.deadline && goal.deadline.slice(0,10) < localDate()) return [{ id: `deadline:${goal.id}:${goal.deadline}`, title: `Date limite passee : ${goal.title}` }];
    return [];
  }), [goals]);
  function update(id: string, change: NoticeState) {
    const next = { ...saved, [id]: { ...saved[id], ...change } };
    setSaved(next); localStorage.setItem(key, JSON.stringify(next));
  }
  const visible = notices.filter(n => !saved[n.id]?.dismissed && (saved[n.id]?.snoozedUntil || 0) <= Date.now());
  return <main className="app-content p-4 md:p-6"><h1 className="text-3xl font-bold mb-2">Notifications</h1><p className="text-muted-foreground mb-6">Le suivi de vos objectifs. Les actions sont conservees dans ce navigateur.</p>
    {!visible.length && <p>Aucune nouvelle notification.</p>}
    <div className="space-y-4">{visible.map(n => <article key={n.id} className="rounded-lg border p-4 bg-card text-card-foreground"><h2 className="font-semibold">{n.title}</h2><p className="text-sm text-muted-foreground">{saved[n.id]?.read ? 'Lue' : 'Non lue'}</p><div className="flex flex-wrap gap-2 mt-3">
      {!saved[n.id]?.read && <Button variant="outline" onClick={() => update(n.id,{ read: true })}>Marquer comme lue</Button>}
      <Button variant="outline" onClick={() => update(n.id,{ snoozedUntil: Date.now()+3600000 })}>Rappeler dans une heure</Button>
      <Button variant="outline" onClick={() => update(n.id,{ dismissed: true })}>Masquer</Button>
    </div></article>)}</div></main>;
}
export default function NotificationsPage() {
  const { user, goals } = useHealth();
  return user ? <Notices key={user.id} userId={user.id} goals={goals} /> : null;
}
