
import { HealthProvider } from '@/contexts/HealthContext';
import { useI18n } from '@/contexts/I18nContext';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, Stethoscope, FlaskConical, Plus, MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const AppointmentsPageContent = () => {
  const { t } = useI18n();

  const upcomingAppointments = [
    {
      id: '1',
      type: 'consultation',
      title: t('appointments.doctorConsultation'),
      doctor: 'Dr. Martin Dubois',
      date: '2025-06-15',
      time: '14:30',
      status: 'confirmed'
    },
    {
      id: '2',
      type: 'nutrition',
      title: t('appointments.nutritionistConsult'),
      doctor: 'Marie Lefebvre',
      date: '2025-06-18',
      time: '10:00',
      status: 'pending'
    },
    {
      id: '3',
      type: 'test',
      title: t('appointments.bloodTest'),
      doctor: 'Laboratoire Central',
      date: '2025-06-20',
      time: '08:15',
      status: 'confirmed'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'completed':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return t('appointments.confirmed');
      case 'pending':
        return t('appointments.pending');
      case 'completed':
        return t('appointments.completed');
      default:
        return status;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'consultation':
        return <Stethoscope className="h-5 w-5" />;
      case 'nutrition':
        return <User className="h-5 w-5" />;
      case 'test':
        return <FlaskConical className="h-5 w-5" />;
      default:
        return <Calendar className="h-5 w-5" />;
    }
  };

  return (
    <div className="flex-1 ml-64">
      <div className="container p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">{t('appointments.title')}</h1>
          <Button className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            {t('appointments.newAppointment')}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-primary" />
                {t('appointments.upcoming')}
              </CardTitle>
              <CardDescription>{t('appointments.upcomingDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{upcomingAppointments.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="mr-2 h-5 w-5 text-blue-500" />
                {t('appointments.schedule')}
              </CardTitle>
              <CardDescription>{t('appointments.scheduleDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                {t('appointments.newAppointment')}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-green-500" />
                {t('appointments.history')}
              </CardTitle>
              <CardDescription>{t('appointments.historyDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                {t('appointments.viewDetails')}
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('appointments.upcoming')}</CardTitle>
            <CardDescription>{t('appointments.upcomingDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="p-4 border rounded-lg flex items-center justify-between hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-primary">
                        {getTypeIcon(appointment.type)}
                      </div>
                      <div>
                        <h4 className="font-medium">{appointment.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {t('appointments.with')} {appointment.doctor}
                        </p>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          {appointment.date} {t('appointments.at')} {appointment.time}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className={`${getStatusColor(appointment.status)} text-white`}>
                        {getStatusText(appointment.status)}
                      </Badge>
                      <div className="flex space-x-1">
                        <Button variant="outline" size="sm">
                          {t('appointments.reschedule')}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium mb-2">{t('appointments.noUpcoming')}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('appointments.scheduleFirst')}
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  {t('appointments.newAppointment')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const AppointmentsPage = () => {
  return (
    <HealthProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <AppointmentsPageContent />
      </div>
    </HealthProvider>
  );
};

export default AppointmentsPage;
