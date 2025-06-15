
import { HealthProvider } from '@/contexts/HealthContext';
import { useI18n } from '@/contexts/I18nContext';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Activity, UserPlus, Shield, Settings, BarChart, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const AdminPageContent = () => {
  const { t } = useI18n();

  const recentActivities = [
    {
      id: '1',
      type: 'registration',
      user: 'Sophie Martin',
      action: t('admin.userRegistered'),
      time: '2 ' + t('admin.minutes'),
      ago: t('admin.ago')
    },
    {
      id: '2',
      type: 'profile',
      user: 'Pierre Durand',
      action: t('admin.profileUpdated'),
      time: '15 ' + t('admin.minutes'),
      ago: t('admin.ago')
    },
    {
      id: '3',
      type: 'goal',
      user: 'Marie Lefebvre',
      action: t('admin.goalSet'),
      time: '1 ' + t('admin.hour'),
      ago: t('admin.ago')
    },
    {
      id: '4',
      type: 'exercise',
      user: 'Jean Dubois',
      action: t('admin.exerciseLogged'),
      time: '2 ' + t('admin.hours'),
      ago: t('admin.ago')
    },
    {
      id: '5',
      type: 'appointment',
      user: 'Anne Bernard',
      action: t('admin.appointmentScheduled'),
      time: '1 ' + t('admin.day'),
      ago: t('admin.ago')
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'registration':
        return <UserPlus className="h-4 w-4 text-green-500" />;
      case 'profile':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'goal':
        return <Activity className="h-4 w-4 text-purple-500" />;
      case 'exercise':
        return <Activity className="h-4 w-4 text-orange-500" />;
      case 'appointment':
        return <Clock className="h-4 w-4 text-pink-500" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex-1 ml-64">
      <div className="container p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">{t('admin.title')}</h1>
          <Button variant="outline" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            {t('admin.systemSettings')}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Users className="mr-2 h-5 w-5 text-primary" />
                {t('admin.totalUsers')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">2,847</p>
              <p className="text-sm text-green-500">+12% {t('admin.thisMonth')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Activity className="mr-2 h-5 w-5 text-green-500" />
                {t('admin.activeUsers')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">1,534</p>
              <p className="text-sm text-green-500">+8% {t('admin.thisMonth')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <UserPlus className="mr-2 h-5 w-5 text-blue-500" />
                {t('admin.newRegistrations')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">23</p>
              <p className="text-sm text-blue-500">{t('admin.today')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Shield className="mr-2 h-5 w-5 text-purple-500" />
                {t('admin.systemHealth')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-500">{t('admin.excellent')}</p>
              <p className="text-sm text-muted-foreground">99.9% uptime</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>{t('admin.userManagement')}</CardTitle>
              <CardDescription>{t('admin.userManagementDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full flex items-center justify-center">
                <Users className="h-4 w-4 mr-2" />
                {t('admin.manageUsers')}
              </Button>
              <Button variant="outline" className="w-full flex items-center justify-center">
                <BarChart className="h-4 w-4 mr-2" />
                {t('admin.viewReports')}
              </Button>
              <Button variant="outline" className="w-full flex items-center justify-center">
                <Settings className="h-4 w-4 mr-2" />
                {t('admin.systemSettings')}
              </Button>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>{t('admin.systemStats')}</CardTitle>
              <CardDescription>{t('admin.systemStatsDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/30 p-4 rounded-md">
                  <p className="text-sm text-muted-foreground">Stockage utilisé</p>
                  <p className="text-2xl font-bold">67%</p>
                </div>
                <div className="bg-muted/30 p-4 rounded-md">
                  <p className="text-sm text-muted-foreground">Bande passante</p>
                  <p className="text-2xl font-bold">12.4 GB</p>
                </div>
                <div className="bg-muted/30 p-4 rounded-md">
                  <p className="text-sm text-muted-foreground">Requêtes API</p>
                  <p className="text-2xl font-bold">45,230</p>
                </div>
                <div className="bg-muted/30 p-4 rounded-md">
                  <p className="text-sm text-muted-foreground">Temps de réponse</p>
                  <p className="text-2xl font-bold">124ms</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('admin.recentActivity')}</CardTitle>
            <CardDescription>{t('admin.recentActivityDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    {getActivityIcon(activity.type)}
                    <div>
                      <p className="font-medium">{activity.user}</p>
                      <p className="text-sm text-muted-foreground">{activity.action}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {activity.ago} {activity.time}
                    </p>
                    <Badge variant="secondary" className="mt-1">
                      Récent
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const AdminPage = () => {
  return (
    <HealthProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <AdminPageContent />
      </div>
    </HealthProvider>
  );
};

export default AdminPage;
