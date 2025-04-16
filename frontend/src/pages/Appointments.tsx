
import { HealthProvider } from '@/contexts/HealthContext';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar, Clock, Video, MessageSquare, User, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AppointmentsPageContent = () => {
  return (
    <div className="flex-1 ml-64">
      <div className="container p-6">
        <h1 className="text-3xl font-bold mb-6">Appointments</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Schedule and manage your consultations with health specialists</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-md bg-primary/5">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Video className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Nutritionist Consultation</h3>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Calendar className="h-4 w-4 mr-1" /> 
                        April 15, 2025
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Clock className="h-4 w-4 mr-1" /> 
                        10:00 AM - 10:45 AM
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <User className="h-4 w-4 mr-1" /> 
                        Dr. Emily Johnson
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Button variant="default" size="sm" className="w-full sm:w-auto">
                      <Video className="h-4 w-4 mr-2" /> Join Call
                    </Button>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto">
                      Reschedule
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Fitness Coach Session</h3>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Calendar className="h-4 w-4 mr-1" /> 
                        April 20, 2025
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Clock className="h-4 w-4 mr-1" /> 
                        5:30 PM - 6:30 PM
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <User className="h-4 w-4 mr-1" /> 
                        Coach Michael Smith
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Button variant="secondary" size="sm" className="w-full sm:w-auto">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto">
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Book New Appointment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-md p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                  <div className="flex items-center mb-2">
                    <MessageSquare className="h-5 w-5 mr-2 text-primary" />
                    <h3 className="font-medium">Nutritionist</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Get personalized diet plans and nutrition advice.</p>
                </div>
                
                <div className="border rounded-md p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                  <div className="flex items-center mb-2">
                    <Users className="h-5 w-5 mr-2 text-primary" />
                    <h3 className="font-medium">Fitness Coach</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Expert guidance to optimize your workout routine.</p>
                </div>
                
                <div className="border rounded-md p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                  <div className="flex items-center mb-2">
                    <User className="h-5 w-5 mr-2 text-primary" />
                    <h3 className="font-medium">Health Specialist</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Comprehensive health assessment and guidance.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Session History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-muted p-3 rounded-full">
                    <MessageSquare className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium">Nutritionist Consultation</h3>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <Calendar className="h-4 w-4 mr-1" /> 
                      March 15, 2025
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <User className="h-4 w-4 mr-1" /> 
                      Dr. Emily Johnson
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">View Notes</Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-start space-x-4">
                  <div className="bg-muted p-3 rounded-full">
                    <Users className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium">Fitness Assessment</h3>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <Calendar className="h-4 w-4 mr-1" /> 
                      March 5, 2025
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <User className="h-4 w-4 mr-1" /> 
                      Coach Michael Smith
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">View Notes</Button>
              </div>
            </div>
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
