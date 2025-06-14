
import { HealthProvider, useHealth } from '@/contexts/HealthContext';
import { useI18n } from '@/contexts/I18nContext';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { User, Mail, Calendar, Ruler, Scale, Activity, Cog, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const ProfilePageContent = () => {
  const { user } = useHealth();
  const { t } = useI18n();
  
  return (
    <div className="flex-1 ml-64">
      <div className="container p-6">
        <h1 className="text-3xl font-bold mb-6">{t('profile.title')}</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-1">
            <CardHeader className="text-center pb-2">
              <div className="w-24 h-24 rounded-full bg-primary/10 mx-auto flex items-center justify-center text-4xl font-bold text-primary mb-4">
                JD
              </div>
              <CardTitle className="text-2xl">John Doe</CardTitle>
              <CardDescription>{t('profile.memberSince')} avril 2025</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-3 text-muted-foreground" />
                  <span>john@example.com</span>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-3 text-muted-foreground" />
                  <span>32 {t('profile.yearsOld')}</span>
                </div>
                
                <div className="flex items-center">
                  <Activity className="h-5 w-5 mr-3 text-muted-foreground" />
                  <span>{t('profile.moderateActivity')}</span>
                </div>
                
                <Button variant="outline" className="w-full mt-4 flex items-center justify-center">
                  <Edit2 className="h-4 w-4 mr-2" /> {t('profile.editProfile')}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>{t('profile.healthInfo')}</CardTitle>
              <CardDescription>{t('profile.healthInfoDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">{t('profile.bodyMetrics')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-muted/30 p-4 rounded-md flex flex-col">
                      <div className="flex items-center mb-2">
                        <Scale className="h-5 w-5 mr-2 text-primary" />
                        <span className="text-sm font-medium">{t('profile.currentWeight')}</span>
                      </div>
                      <span className="text-2xl font-bold">{user.currentWeight} {t('profile.kg')}</span>
                    </div>
                    
                    <div className="bg-muted/30 p-4 rounded-md flex flex-col">
                      <div className="flex items-center mb-2">
                        <Scale className="h-5 w-5 mr-2 text-primary" />
                        <span className="text-sm font-medium">{t('profile.goalWeight')}</span>
                      </div>
                      <span className="text-2xl font-bold">{user.goalWeight} {t('profile.kg')}</span>
                    </div>
                    
                    <div className="bg-muted/30 p-4 rounded-md flex flex-col">
                      <div className="flex items-center mb-2">
                        <Ruler className="h-5 w-5 mr-2 text-primary" />
                        <span className="text-sm font-medium">{t('profile.height')}</span>
                      </div>
                      <span className="text-2xl font-bold">{user.height} {t('profile.cm')}</span>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">{t('profile.nutritionGoals')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-muted/30 p-4 rounded-md flex flex-col">
                      <div className="flex items-center mb-2">
                        <Activity className="h-5 w-5 mr-2 text-primary" />
                        <span className="text-sm font-medium">{t('profile.dailyCalorieGoal')}</span>
                      </div>
                      <span className="text-2xl font-bold">{user.goalCalories} {t('profile.kcal')}</span>
                    </div>
                    
                    <div className="bg-muted/30 p-4 rounded-md flex items-center justify-between">
                      <div>
                        <div className="flex items-center mb-1">
                          <Cog className="h-5 w-5 mr-2 text-primary" />
                          <span className="text-sm font-medium">{t('profile.adjustGoals')}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{t('profile.customizeTargets')}</span>
                      </div>
                      <Button variant="outline" size="sm">{t('profile.configure')}</Button>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between">
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {t('profile.viewHealthHistory')}
                  </Button>
                  
                  <Button variant="outline" size="sm" className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    {t('profile.updateHealthProfile')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('profile.accountSettings')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-4">
                <div>
                  <h3 className="font-medium">{t('profile.notificationPreferences')}</h3>
                  <p className="text-sm text-muted-foreground">{t('profile.notificationPreferencesDesc')}</p>
                </div>
                <Button variant="outline" className="mt-2 md:mt-0">{t('profile.manage')}</Button>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-4">
                <div>
                  <h3 className="font-medium">{t('profile.privacySettings')}</h3>
                  <p className="text-sm text-muted-foreground">{t('profile.privacySettingsDesc')}</p>
                </div>
                <Button variant="outline" className="mt-2 md:mt-0">{t('profile.configure')}</Button>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="font-medium">{t('profile.connectedDevices')}</h3>
                  <p className="text-sm text-muted-foreground">{t('profile.connectedDevicesDesc')}</p>
                </div>
                <Button variant="outline" className="mt-2 md:mt-0">{t('profile.addDevice')}</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

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
