
import { HealthProvider } from '@/contexts/HealthContext';
import { useI18n } from '@/contexts/I18nContext';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BellRing, Smartphone, Lock, UserCog } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { AppearanceSettings } from '@/components/settings/AppearanceSettings';
import { ChangePasswordForm } from '@/components/settings/ChangePasswordForm';
import { EditProfileForm } from '@/components/profile/EditProfileForm';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useEffect, useState } from 'react';

const SettingsPageContent = () => {
  const { t } = useI18n();
  const [isMobile, setIsMobile] = useState(false);
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  const [showEditProfileForm, setShowEditProfileForm] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  return (
    <div className="flex-1 transition-all duration-300 sm:ml-16 md:ml-64">
      <div className="container p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">{t('settings.title')}</h1>
          <ThemeToggle />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Notifications Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BellRing className="mr-2 h-5 w-5 text-primary" />
                  {t('settings.notifications')}
                </CardTitle>
                <CardDescription>{t('settings.notificationsDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">{t('settings.emailNotifications')}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t('settings.emailNotificationsDesc')}
                      </p>
                    </div>
                    <Switch id="email-notifications" defaultChecked />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications">{t('settings.pushNotifications')}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t('settings.pushNotificationsDesc')}
                      </p>
                    </div>
                    <Switch id="push-notifications" defaultChecked />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="reminder-notifications">{t('settings.dailyReminders')}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t('settings.dailyRemindersDesc')}
                      </p>
                    </div>
                    <Switch id="reminder-notifications" defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Account Settings Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserCog className="mr-2 h-5 w-5 text-primary" />
                  {t('settings.accountSettings')}
                </CardTitle>
                <CardDescription>{t('settings.accountSettingsDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-4">
                    <div>
                      <h3 className="font-medium">{t('settings.changePassword')}</h3>
                      <p className="text-sm text-muted-foreground">{t('settings.changePasswordDesc')}</p>
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
                      <h3 className="font-medium">{t('settings.emailAddress')}</h3>
                      <p className="text-sm text-muted-foreground">john@example.com</p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="mt-2 md:mt-0"
                      onClick={() => setShowEditProfileForm(true)}
                    >
                      {t('button.change')}
                    </Button>
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="font-medium">{t('settings.deleteAccount')}</h3>
                      <p className="text-sm text-muted-foreground">{t('settings.deleteAccountDesc')}</p>
                    </div>
                    <Button variant="destructive" className="mt-2 md:mt-0">{t('button.delete')}</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Privacy Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="mr-2 h-5 w-5 text-primary" />
                  {t('settings.privacy')}
                </CardTitle>
                <CardDescription>{t('settings.privacyDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="data-sharing">{t('settings.dataSharing')}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t('settings.dataSharingDesc')}
                      </p>
                    </div>
                    <Switch id="data-sharing" defaultChecked />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="two-factor-auth">{t('settings.twoFactorAuth')}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t('settings.twoFactorAuthDesc')}
                      </p>
                    </div>
                    <Switch id="two-factor-auth" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-4 md:space-y-6">
            <AppearanceSettings />
            
            {/* Connected Devices Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Smartphone className="mr-2 h-5 w-5 text-primary" />
                  {t('settings.connectedDevices')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {t('settings.connectedDevicesDesc')}
                  </p>
                  <Button variant="outline" className="w-full">
                    {t('settings.connectDevice')}
                  </Button>
                </div>
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
        open={showEditProfileForm} 
        onOpenChange={setShowEditProfileForm} 
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
