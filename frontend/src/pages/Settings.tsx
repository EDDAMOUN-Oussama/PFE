import { apiFetch } from '@/lib/api';

import { HealthProvider, useHealth } from '@/contexts/HealthContext';
import { useI18n } from '@/contexts/I18nContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BellRing, Smartphone, Lock, UserCog, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChangePasswordForm } from '@/components/settings/ChangePasswordForm';
import { EditProfileForm } from '@/components/profile/EditProfileForm';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Stethoscope, CheckCircle } from 'lucide-react';
import DeleteAccountSection from '@/components/settings/DeleteAccountSection';


const SettingsPageContent = () => {
  const [showSpecialistRequest, setShowSpecialistRequest] = useState(false);
  const { user, isLoading, refetchUser } = useHealth();
  const { t } = useI18n();
  const [isMobile, setIsMobile] = useState(false);
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);

  const handleSpecialistRequest = async () => {
  if (!user) return;
    setIsSubmittingRequest(true);
    try {
      const response = await apiFetch('createSpecialistRequest.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id }),
      });
      const result = await response.json();
      console.log(result);
      if (result.success) {
        toast.success('Demande envoyée avec succès !');
        setShowSpecialistRequest(true);
        await refetchUser(); // On rafraîchit les données pour obtenir le nouveau statut
      } else {
        toast.error(`Erreur : ${result.message}`);
      }
    } catch (error) {
      toast.error("Erreur de connexion.");
    } finally {
      setIsSubmittingRequest(false);

    }
  };

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  if (isLoading) {
    return (
      <div className="app-content flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }


  if (!user) {   return <div className="app-content flex items-center justify-center h-screen"><p className="text-red-500">Erreur : Impossible de charger les données.</p></div>; }

 const renderSpecialistCardContent =  () => {
    // await refetchUser();
    console.log('User specialist request status:', user.specialist_request_status);
    if (user.specialist_request_status === 'pending') {
      // Do not update state here!
      return 1;
    } else {
      return 0;
    }
 };

  return (
    <div className="app-content min-h-screen overflow-auto">
      <div className="container p-4 md:p-6 h-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Paramètres</h1>
          <ThemeToggle />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 h-full pb-6">
          <div className="lg:col-span-3 space-y-4 md:space-y-6">
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

                    <DeleteAccountSection />
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
                { !renderSpecialistCardContent() && !showSpecialistRequest ? (
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

        <SettingsPageContent />
      </div>
    </HealthProvider>
  );
};

export default SettingsPage;
