
import { useState, useEffect } from 'react';
import { HealthProvider, useHealth } from '@/contexts/HealthContext';
import { useI18n } from '@/contexts/I18nContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { User, Mail, Calendar, Ruler, Scale, Activity, Edit2, Loader2, } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { EditProfileForm } from '@/components/profile/EditProfileForm';
import { EditHealthProfileForm } from '@/components/profile/EditHealthProfileForm';

const ProfilePageContent = () => {
  const { user, isLoading, refetchUser } = useHealth();
  const { t } = useI18n();
  const [showSpecialistRequest, setShowSpecialistRequest] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showEditHealthProfile, setShowEditHealthProfile] = useState(false);

  if (isLoading) { return <div className="app-content flex items-center justify-center h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>; }
  if (!user) { return <div className="app-content flex items-center justify-center h-screen"><p className="text-red-500">Erreur : Impossible de charger les données du profil.</p></div>; }


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

  const handleSpecialistRequest = () => {
    setShowSpecialistRequest(true);
    toast.success('Demande de spécialiste envoyée avec succès');
  };

  return (
    <div className="app-content">
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

                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-3 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>

                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-3 text-muted-foreground" />
                  <span>{calculateAge(user.birthdate)} {t('profile.yearsOld')}</span>
                </div>

                <div className="flex items-center">
                  <Activity className="h-5 w-5 mr-3 text-muted-foreground" />
                  <span>{user.activityLevel}</span>
                </div>

                <Button
                  variant="outline"
                  className="w-full mt-4 flex items-center justify-center"
                  onClick={() => setShowEditProfile(true)}
                >
                  <Edit2 className="h-4 w-4 mr-2" /> Modifier le profil
                </Button>
                </div>
              </CardContent>
            </Card>
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Informations de santé</CardTitle>
              <CardDescription>Vos métriques actuelles et données de santé</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Métriques corporelles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-muted/30 p-4 rounded-md flex flex-col">
                      <div className="flex items-center mb-2">
                        <Scale className="h-5 w-5 mr-2 text-primary" />
                        <span className="text-sm font-medium">Poids actuel</span>
                      </div>
                      <span className="text-2xl font-bold">{user.currentWeight} kg</span>
                    </div>

                    <div className="bg-muted/30 p-4 rounded-md flex flex-col">
                      <div className="flex items-center mb-2">
                        <Scale className="h-5 w-5 mr-2 text-primary" />
                        <span className="text-sm font-medium">Poids objectif</span>
                      </div>
                      <span className="text-2xl font-bold">{user.goalWeight} kg</span>
                    </div>

                    <div className="bg-muted/30 p-4 rounded-md flex flex-col">
                      <div className="flex items-center mb-2">
                        <Ruler className="h-5 w-5 mr-2 text-primary" />
                        <span className="text-sm font-medium">Taille</span>
                      </div>
                      <span className="text-2xl font-bold">{user.height} cm</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Objectifs nutritionnels</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-muted/30 p-4 rounded-md flex flex-col">
                      <div className="flex items-center mb-2">
                        <Activity className="h-5 w-5 mr-2 text-primary" />
                        <span className="text-sm font-medium">Objectif calorique quotidien</span>
                      </div>
                      <span className="text-2xl font-bold">{user.goalCalories} kcal</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between">

                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center"
                    onClick={() => setShowEditHealthProfile(true)}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Mettre à jour le profil de santé
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <EditProfileForm
          user={user}
          open={showEditProfile}
          onOpenChange={setShowEditProfile}
          refetchUser={refetchUser}
        />

        <EditHealthProfileForm
          user={user}
          open={showEditHealthProfile}
          onOpenChange={setShowEditHealthProfile}
          refetchUser={refetchUser}
        />
      </div>
    </div>
  );
};

const ProfilePage = () => {
  return (
    <HealthProvider>
      <div className="flex min-h-screen bg-background">

        <ProfilePageContent />
      </div>
    </HealthProvider>
  );
};

export default ProfilePage;
