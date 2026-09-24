import { useEffect, useState, type FormEvent } from 'react';
import { api } from '@/lib/api';
import type { User } from '@/types/health';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { EmailVerificationDialog } from './EmailVerificationDialog';
import { toast } from 'sonner';
interface Props { user: User; open: boolean; onOpenChange: (open: boolean) => void; refetchUser: () => Promise<void>; }
export function EditProfileForm({ user, open, onOpenChange, refetchUser }: Props) {
  const [form, setForm] = useState({ name: '', email: '', birthdate: '' });
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (open) { setForm({ name: user.name, email: user.email, birthdate: user.birthdate.slice(0,10) }); setPendingEmail(null); }
  }, [open, user.id, user.name, user.email, user.birthdate]);
  async function submit(event: FormEvent) {
    event.preventDefault(); setSaving(true);
    try {
      const result = await api<{ needsEmailVerification: boolean }>('updateUser.php', { id: user.id, ...form });
      if (result.needsEmailVerification) { setPendingEmail(form.email); toast.info('Code envoye.'); }
      else { await refetchUser(); onOpenChange(false); toast.success('Profil mis a jour.'); }
    } catch (error) { toast.error(error instanceof Error ? error.message : 'Mise a jour impossible.'); }
    finally { setSaving(false); }
  }
  if (pendingEmail) return <EmailVerificationDialog open={open} newEmail={pendingEmail} onOpenChange={onOpenChange}
    onCancel={() => setPendingEmail(null)} onVerificationComplete={async () => { setPendingEmail(null); await refetchUser(); onOpenChange(false); }} />;
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent><DialogHeader><DialogTitle>Modifier le profil</DialogTitle><DialogDescription>Vos informations personnelles.</DialogDescription></DialogHeader>
    <form onSubmit={submit} className="space-y-4">
      <div><Label htmlFor="profile-name">Nom</Label><Input id="profile-name" required maxLength={50} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
      <div><Label htmlFor="profile-email">Email</Label><Input id="profile-email" required type="email" maxLength={100} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
      <div><Label htmlFor="profile-birthdate">Date de naissance</Label><Input id="profile-birthdate" required type="date" value={form.birthdate} onChange={e => setForm({ ...form, birthdate: e.target.value })} /></div>
      <div className="flex gap-2"><Button disabled={saving} type="submit">{saving ? 'Enregistrement...' : 'Enregistrer'}</Button><Button disabled={saving} type="button" variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button></div>
    </form></DialogContent></Dialog>;
}
