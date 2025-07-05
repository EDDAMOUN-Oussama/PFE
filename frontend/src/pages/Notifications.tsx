
import { HealthProvider } from '@/contexts/HealthContext';
import { useI18n } from '@/contexts/I18nContext';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Clock, Dumbbell, Check, X, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const NotificationsPageContent = () => {
  const { t } = useI18n();
  const navigate = useNavigate();

  const handleMarkAsRead = (id: string) => {
    toast.success(t('notifications.markAsRead'));
  };

  const handleDismiss = (id: string) => {
    toast.success(t('notifications.dismiss'));
  };

  const handleSnooze = (id: string) => {
    toast.success(t('notifications.snooze'));
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  const notifications = [
    {
      id: '1',
      type: 'exercise_reminder',
      title: t('notifications.workoutTime'),
      message: t('notifications.strengthTraining'),
      time: '2',
      timeUnit: t('notifications.minutesAgo'),
      isRead: false,
      priority: 'high'
    },
    {
      id: '2',
      type: 'exercise_reminder',
      title: t('notifications.morningRun'),
      message: t('notifications.morningRunDesc'),
      time: '1',
      timeUnit: t('notifications.hourAgo'),
      isRead: false,
      priority: 'medium'
    },
    {
      id: '3',
      type: 'goal_update',
      title: t('notifications.weeklyGoal'),
      message: t('notifications.weeklyGoalDesc'),
      time: '3',
      timeUnit: t('notifications.hoursAgo'),
      isRead: true,
      priority: 'low'
    }
  ];

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-green-500 bg-green-50';
      default: return 'border-gray-200 bg-white';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'exercise_reminder': return <Dumbbell className="h-5 w-5" />;
      case 'goal_update': return <Clock className="h-5 w-5" />;
      default: return <Bell className="h-5 w-5" />;
    }
  };

  return (
    <div className="flex-1 transition-all duration-300 sm:ml-16 md:ml-64">
      <div className="container p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{t('notifications.title')}</h1>
            <p className="text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} ${t('notifications.unreadCount')}` : t('notifications.allCaughtUp')}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleSettingsClick}>
            <Settings className="h-4 w-4 mr-2" />
            {t('button.settings')}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Bell className="mr-2 h-5 w-5 text-primary" />
                {t('notifications.total')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{notifications.length}</p>
              <p className="text-sm text-muted-foreground">{t('notifications.allNotifications')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Dumbbell className="mr-2 h-5 w-5 text-blue-500" />
                {t('notifications.exercise')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {notifications.filter(n => n.type === 'exercise_reminder').length}
              </p>
              <p className="text-sm text-muted-foreground">{t('notifications.exerciseReminders')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Clock className="mr-2 h-5 w-5 text-orange-500" />
                {t('notifications.unread')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{unreadCount}</p>
              <p className="text-sm text-muted-foreground">{t('notifications.needAttention')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Check className="mr-2 h-5 w-5 text-green-500" />
                {t('notifications.today')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">3</p>
              <p className="text-sm text-muted-foreground">{t('notifications.todaysReminders')}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('notifications.recent')}</CardTitle>
            <CardDescription>{t('notifications.recentDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border rounded-lg ${getPriorityColor(notification.priority)} ${
                    !notification.isRead ? 'border-l-4' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="mt-1 text-muted-foreground">
                        {getTypeIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-medium ${!notification.isRead ? 'font-semibold' : ''}`}>
                          {notification.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {t('time.ago')} {notification.time} {notification.timeUnit}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      {notification.type === 'exercise_reminder' && !notification.isRead && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSnooze(notification.id)}
                        >
                          <Clock className="h-4 w-4 mr-1" />
                          {t('notifications.snooze')}
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDismiss(notification.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
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

const NotificationsPage = () => {
  return (
    <HealthProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <NotificationsPageContent />
      </div>
    </HealthProvider>
  );
};

export default NotificationsPage;
