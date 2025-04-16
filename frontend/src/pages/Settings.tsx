
import { HealthProvider } from '@/contexts/HealthContext';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BellRing, Smartphone, Lock, Mail, UserCog, Database, Globe, Sun, Moon, Languages } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

const SettingsPageContent = () => {
  return (
    <div className="flex-1 ml-64">
      <div className="container p-6">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BellRing className="mr-2 h-5 w-5 text-primary" />
                  Notifications
                </CardTitle>
                <CardDescription>Configure how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive emails about your activity and progress
                      </p>
                    </div>
                    <Switch id="email-notifications" defaultChecked />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notifications directly on your device
                      </p>
                    </div>
                    <Switch id="push-notifications" defaultChecked />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="reminder-notifications">Daily Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Get reminders to log your daily health data
                      </p>
                    </div>
                    <Switch id="reminder-notifications" defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserCog className="mr-2 h-5 w-5 text-primary" />
                  Account Settings
                </CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-4">
                    <div>
                      <h3 className="font-medium">Change Password</h3>
                      <p className="text-sm text-muted-foreground">Update your account password</p>
                    </div>
                    <Button variant="outline" className="mt-2 md:mt-0">Update</Button>
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-4">
                    <div>
                      <h3 className="font-medium">Email Address</h3>
                      <p className="text-sm text-muted-foreground">john@example.com</p>
                    </div>
                    <Button variant="outline" className="mt-2 md:mt-0">Change</Button>
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="font-medium">Delete Account</h3>
                      <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                    </div>
                    <Button variant="destructive" className="mt-2 md:mt-0">Delete</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="mr-2 h-5 w-5 text-primary" />
                  Privacy & Security
                </CardTitle>
                <CardDescription>Manage your privacy preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="data-sharing">Data Sharing</Label>
                      <p className="text-sm text-muted-foreground">
                        Share anonymized data to improve our services
                      </p>
                    </div>
                    <Switch id="data-sharing" defaultChecked />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="two-factor-auth">Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch id="two-factor-auth" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sun className="mr-2 h-5 w-5 text-primary" />
                  Appearance
                </CardTitle>
                <CardDescription>Customize the application theme</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Sun className="h-5 w-5" />
                      <Label htmlFor="theme-mode">Light Mode</Label>
                    </div>
                    <Switch id="theme-mode" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Moon className="h-5 w-5" />
                      <Label htmlFor="dark-mode">Dark Mode</Label>
                    </div>
                    <Switch id="dark-mode" defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="mr-2 h-5 w-5 text-primary" />
                  Regional Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <Label>Language</Label>
                    <select className="w-full p-2 border rounded-md">
                      <option>English</option>
                      <option>Français</option>
                      <option>Español</option>
                      <option>Deutsch</option>
                    </select>
                  </div>
                  
                  <div className="space-y-1">
                    <Label>Units</Label>
                    <select className="w-full p-2 border rounded-md">
                      <option>Metric (kg, cm)</option>
                      <option>Imperial (lb, in)</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Smartphone className="mr-2 h-5 w-5 text-primary" />
                  Connected Devices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    No devices connected yet. Connect a fitness tracker or smart scale to automatically sync your health data.
                  </p>
                  <Button variant="outline" className="w-full">
                    Connect a Device
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
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
