import { HealthProvider } from '@/contexts/HealthContext';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Clock, Dumbbell, Check, X, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const NotificationsPageContent = () => {
  const navigate = useNavigate();

  const handleMarkAsRead = (id: string) => {
    toast.success('Notification marked as read');
  };

  const handleDismiss = (id: string) => {
    toast.success('Notification dismissed');
  };

  const handleSnooze = (id: string) => {
    toast.success('Reminder snoozed for 30 minutes');
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  // Sample notifications data
  const notifications = [
    {
      id: '1',
      type: 'exercise_reminder',
      title: 'Time for your workout!',
      message: 'You planned to do strength training at 6:00 PM today.',
      time: '2 minutes ago',
      isRead: false,
      priority: 'high'
    },
    {
      id: '2',
      type: 'exercise_reminder',
      title: 'Morning run reminder',
      message: 'Don\'t forget your 30-minute morning run.',
      time: '1 hour ago',
      isRead: false,
      priority: 'medium'
    },
    {
      id: '3',
      type: 'goal_update',
      title: 'Weekly goal progress',
      message: 'You\'re 80% towards your weekly exercise goal!',
      time: '3 hours ago',
      isRead: true,
      priority: 'low'
    },
    {
      id: '4',
      type: 'exercise_reminder',
      title: 'Yoga session',
      message: 'Time for your evening yoga session.',
      time: '1 day ago',
      isRead: true,
      priority: 'medium'
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
    <div className="flex-1 ml-64">
      <div className="container p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleSettingsClick}>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Bell className="mr-2 h-5 w-5 text-primary" />
                Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{notifications.length}</p>
              <p className="text-sm text-muted-foreground">All notifications</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Dumbbell className="mr-2 h-5 w-5 text-blue-500" />
                Exercise
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {notifications.filter(n => n.type === 'exercise_reminder').length}
              </p>
              <p className="text-sm text-muted-foreground">Exercise reminders</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Clock className="mr-2 h-5 w-5 text-orange-500" />
                Unread
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{unreadCount}</p>
              <p className="text-sm text-muted-foreground">Need attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Check className="mr-2 h-5 w-5 text-green-500" />
                Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">3</p>
              <p className="text-sm text-muted-foreground">Today's reminders</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
            <CardDescription>Stay on top of your fitness goals</CardDescription>
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
                          {notification.time}
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
                          Snooze
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
