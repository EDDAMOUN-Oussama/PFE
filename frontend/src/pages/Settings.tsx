
import { HealthProvider, useHealth } from '@/contexts/HealthContext';
import { useI18n } from '@/contexts/I18nContext';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BellRing, Smartphone, Lock, UserCog, Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ChangePasswordForm } from '@/components/settings/ChangePasswordForm';
import { EditProfileForm } from '@/components/profile/EditProfileForm';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Stethoscope, CheckCircle } from 'lucide-react';

const SettingsPageContent = () => {
  const [showSpecialistRequest, setShowSpecialistRequest] = useState(false);
  const { user, isLoading, refetchUser } = useHealth();
  const { t } = useI18n();
  const [isMobile, setIsMobile] = useState(false);
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  const handleSpecialistRequest = () => {
    setShowSpecialistRequest(true);
    toast.success('Demande de spécialiste envoyée avec succès');
  };

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1 ml-64 flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex-1 ml-64 flex items-center justify-center h-screen">
        <p className="text-red-500">Erreur : Impossible de charger les données.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 transition-all duration-300 sm:ml-16 md:ml-64 h-screen overflow-auto">
      <div className="container p-4 md:p-6 h-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Paramètres</h1>
          <ThemeToggle />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 h-full pb-6">
          <div className="lg:col-span-3 space-y-4 md:space-y-6">
            {/* Notifications Card */}
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BellRing className="mr-2 h-5 w-5 text-primary" />
                  Notifications
                </CardTitle>
                <CardDescription>
                  Configurez comment vous recevez les notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Notifications par email</Label>
                      <p className="text-sm text-muted-foreground">
                        Recevez des emails sur votre activité et vos progrès
                      </p>
                    </div>
                    <Switch id="email-notifications" defaultChecked />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications">Notifications push</Label>
                      <p className="text-sm text-muted-foreground">
                        Recevez des notifications directement sur votre appareil
                      </p>
                    </div>
                    <Switch id="push-notifications" defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Account Settings Card */}
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserCog className="mr-2 h-5 w-5 text-primary" />
                  Paramètres du compte
                </CardTitle>
                <CardDescription>Gérez les préférences de votre compte</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-4">
                    <div>
                      <h3 className="font-medium">Changer le mot de passe</h3>
                      <p className="text-sm text-muted-foreground">
                        Mettez à jour le mot de passe de votre compte
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="mt-2 md:mt-0"
                      onClick={() => setShowChangePasswordForm(true)}
                    >
                      Mettre à jour
                    </Button>
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-4">
                    <div>
                      <h3 className="font-medium">Adresse email</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="mt-2 md:mt-0"
                      onClick={() => setShowEditProfile(true)}
                    >
                      Changer
                    </Button>
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="font-medium">Supprimer le compte</h3>
                      <p className="text-sm text-muted-foreground">
                        Supprimez définitivement votre compte et toutes les données
                      </p>
                    </div>
                    <Button variant="destructive" className="mt-2 md:mt-0">
                      Supprimer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Specialist Request Card */}
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Stethoscope className="mr-2 h-5 w-5 text-primary" />
                  Devenir Spécialiste
                </CardTitle>
                <CardDescription>
                  Demandez à devenir un spécialiste de santé vérifié
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!showSpecialistRequest ? (
                  <Button 
                    variant="default" 
                    className="w-full flex items-center justify-center"
                    onClick={handleSpecialistRequest}
                  >
                    <Stethoscope className="h-4 w-4 mr-2" />
                    Faire une demande pour devenir spécialiste
                  </Button>
                ) : (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-sm text-green-800">
                        Demande de spécialiste en cours de traitement
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <ChangePasswordForm 
        open={showChangePasswordForm} 
        onOpenChange={setShowChangePasswordForm} 
      />
      
      <EditProfileForm 
        user={user}
        open={showEditProfile} 
        onOpenChange={setShowEditProfile} 
        refetchUser={refetchUser}
      />
    </div>
  );
};

const SettingsPage = () => {
  return (
    <HealthProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <SettingsPageContent />
      </div>
    </HealthProvider>
  );
};

export default SettingsPage;
