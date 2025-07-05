import { useEffect, useState } from 'react';
import { HealthProvider } from '@/contexts/HealthContext';
import { useI18n } from '@/contexts/I18nContext';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Activity, UserPlus, Shield, Settings, CheckCircle, X, User, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const AdminPageContent = () => {
  const { t } = useI18n();
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost/pfe/backend/controllers/getSpecialistRequests.php');
      const data = await response.json();
      if (data.success) {
        setRequests(data.requests);
      } else {
        toast.error("Erreur lors du chargement des demandes.");
      }
    } catch (error) {
      toast.error("Impossible de charger les demandes.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleRequestUpdate = async (requestId, newStatus) => {
    try {
      const response = await fetch('http://localhost/pfe/backend/controllers/updateSpecialistRequest.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request_id: requestId, new_status: newStatus }),
      });
      const result = await response.json();

      if (result.success) {
        toast.success(`Demande ${newStatus === 'approved' ? 'approuvée' : 'rejetée'}.`);
        setRequests(prev => prev.filter(req => req.id !== requestId));
      } else {
        toast.error(`Erreur : ${result.message}`);
      }
    } catch (error) {
      toast.error("Erreur de connexion.");
    }
  };
  
  return (
    <div className="flex-1 ml-64">
      <div className="container p-6">
        <h1 className="text-3xl font-bold mb-6">{t('admin.title')}</h1>
        {/* ... Cartes de statistiques ... */}

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="specialists">Demandes Spécialistes ({requests.length})</TabsTrigger>
            {/* <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger> */}
          </TabsList>

          {/* <TabsContent value="overview">... Contenu de la vue d'ensemble ...</TabsContent> */}

          <TabsContent value="specialists" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Demandes de Spécialistes</CardTitle>
                <CardDescription>Gérez les demandes des utilisateurs pour devenir spécialistes</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
                ) : requests.length > 0 ? (
                  <div className="space-y-4">
                    {requests.map((request) => (
                      <div key={request.id} className="p-4 border rounded-lg flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center"><User className="h-6 w-6 text-primary" /></div>
                          <div><h4 className="font-medium">{request.name}</h4><p className="text-sm text-muted-foreground">{request.email}</p></div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline" onClick={() => handleRequestUpdate(request.id, 'approved')} className="text-green-600 border-green-600 hover:bg-green-50">
                            <CheckCircle className="h-4 w-4 mr-1" /> Approuver
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleRequestUpdate(request.id, 'rejected')} className="text-red-600 border-red-600 hover:bg-red-50">
                            <X className="h-4 w-4 mr-1" /> Rejeter
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-medium mb-2">Aucune demande en attente</h3>
                    <p className="text-sm text-muted-foreground">Toutes les demandes de spécialistes ont été traitées.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
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