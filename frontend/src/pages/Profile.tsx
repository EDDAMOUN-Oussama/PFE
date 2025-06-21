import { useState, useEffect } from 'react';
import { HealthProvider, useHealth } from '@/contexts/HealthContext';
import { useI18n } from '@/contexts/I18nContext';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { User, Mail, Calendar, Ruler, Scale, Activity, Edit2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

// --- COMPOSANT POUR LE FORMULAIRE DE MODIFICATION (LA MODALE) ---
const EditProfileForm = ({ user, open, onOpenChange, refetchUser }) => {
  const [formData, setFormData] = useState({ name: '', email: '', birthdate: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        birthdate: user.birthdate ? user.birthdate.split(' ')[0] : '', 
      });
    }
  }, [user, open]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost/pfe/backend/controllers/updateUser.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, ...formData }),
      });
      const result = await response.json();
      if (result.success) {
        toast.success('Profil mis à jour avec succès !');
        await refetchUser(); 
        onOpenChange(false);
      } else {
        toast.error(`Erreur : ${result.message}`);
      }
    } catch (error) {
      toast.error('Une erreur de connexion est survenue.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Modifier le profil</DialogTitle><DialogDescription>Mettez à jour vos informations personnelles.</DialogDescription></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div><Label htmlFor="name">Prénom et Nom</Label><Input id="name" value={formData.name} onChange={handleChange} /></div>
          <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={formData.email} onChange={handleChange} /></div>
          <div><Label htmlFor="birthdate">Date de naissance</Label><Input id="birthdate" type="date" value={formData.birthdate} onChange={handleChange} /></div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Sauvegarde...' : 'Sauvegarder'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};


// --- COMPOSANT POUR LE CONTENU DE LA PAGE PROFIL ---
const ProfilePageContent = () => {
  const { user, isLoading, refetchUser } = useHealth(); 
  const { t } = useI18n();
  const [showEditProfile, setShowEditProfile] = useState(false);

  if (isLoading) { return <div className="flex-1 ml-64 flex items-center justify-center h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>; }
  if (!user) { return <div className="flex-1 ml-64 flex items-center justify-center h-screen"><p className="text-red-500">Erreur : Impossible de charger les données du profil.</p></div>; }

  const calculateAge = (birthdateString) => {
    if (!birthdateString) return '?';
    const birthDate = new Date(birthdateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) { age--; }
    return age;
  };
  
  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : '';
  
  return (
    <>
      <div className="flex-1 ml-64">
        <div className="container p-6">
          <h1 className="text-3xl font-bold mb-6">{t('profile.title')}</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card className="lg:col-span-1">
              <CardHeader className="text-center pb-2">
                <div className="w-24 h-24 rounded-full bg-primary/10 mx-auto flex items-center justify-center text-4xl font-bold text-primary mb-4">{getInitials(user.name)}</div>
                <CardTitle className="text-2xl">{user.name}</CardTitle>
                {user.memberSince && <CardDescription>{t('profile.memberSince')} {new Date(user.memberSince).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</CardDescription>}
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center"><Mail className="h-5 w-5 mr-3 text-muted-foreground" /><span>{user.email}</span></div>
                  <div className="flex items-center"><Calendar className="h-5 w-5 mr-3 text-muted-foreground" /><span>{calculateAge(user.birthdate)} {t('profile.yearsOld')}</span></div>
                  <div className="flex items-center"><Activity className="h-5 w-5 mr-3 text-muted-foreground" /><span>{user.activityLevel}</span></div>
                  <Button variant="outline" className="w-full mt-4" onClick={() => setShowEditProfile(true)}><Edit2 className="h-4 w-4 mr-2" /> Modifier le profil</Button>
                </div>
              </CardContent>
            </Card>
            <Card className="lg:col-span-2">{/* Données de santé ... */}</Card>
          </div>
        </div>
      </div>
      <EditProfileForm user={user} open={showEditProfile} onOpenChange={setShowEditProfile} refetchUser={refetchUser} />
    </>
  );
};


// --- COMPOSANT PRINCIPAL DE LA PAGE ---
const ProfilePage = () => {
  return (
    <HealthProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <ProfilePageContent />
      </div>
    </HealthProvider>
  );
};

export default ProfilePage;