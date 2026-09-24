import { useState, useEffect } from 'react';
import { HealthProvider, useHealth } from '@/contexts/HealthContext';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, CheckCircle, User, Stethoscope, Loader2, AlertCircle, X } from 'lucide-react';
import { toast } from 'sonner';

const SpecialistPageContent = () => {
    const { user, isLoading: isUserLoading } = useHealth();
    const [appointments, setAppointments] = useState([]);
    const [isLoadingAppointments, setIsLoadingAppointments] = useState(true);

    const fetchAppointmentsForSpecialist = async () => {
        if (!user) return;
        setIsLoadingAppointments(true);
        try {
            const response = await fetch(`http://localhost/pfe/PFE/backend/controllers/getAppointments.php?user_id=${user.id}&role=${user.role}`);
            const data = await response.json();
            if (data.success) {
                setAppointments(data.appointments);
            }
        } catch (error) {
            toast.error("Erreur lors du chargement des rendez-vous.");
        } finally {
            setIsLoadingAppointments(false);
        }
    };

    useEffect(() => {
        if (user && user.role === 'specialist') {
            fetchAppointmentsForSpecialist();
        }
    }, [user]);

    const handleStatusUpdate = async (appointmentId, newStatus) => {
        try {
            const response = await fetch('http://localhost/pfe/PFE/backend/controllers/updateAppointmentStatus.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ appointment_id: appointmentId, new_status: newStatus }),
            });
            const result = await response.json();
            if (result.success) {
                toast.success(`Rendez-vous ${newStatus === 'confirmed' ? 'confirmé' : 'rejeté'} !`);
                fetchAppointmentsForSpecialist(); // Rafraîchir la liste complète
            } else {
                toast.error("Erreur lors de la mise à jour.");
            }
        } catch (error) {
            toast.error("Une erreur de connexion est survenue.");
        }
    };

    if (isUserLoading) {
        return <div className="flex-1 ml-64 flex items-center justify-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    if (user?.role !== 'specialist') {
        return <div className="flex-1 ml-64 flex items-center justify-center h-screen"><p>Accès refusé. Cette page est réservée aux spécialistes.</p></div>;
    }

    const pendingAppointments = appointments.filter(a => a.status === 'pending');
    const otherAppointments = appointments.filter(a => a.status !== 'pending');

    return (
        <div className="flex-1 ml-64">
            <div className="container p-6">
                <h1 className="text-3xl font-bold flex items-center mb-6"><Stethoscope className="mr-3 h-8 w-8 text-primary" /> Espace Spécialiste</h1>
                <Tabs defaultValue="pending" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="pending">Demandes en attente ({pendingAppointments.length})</TabsTrigger>
                        <TabsTrigger value="confirmed">Rendez-vous à venir / passés ({otherAppointments.length})</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="pending">
                        <Card>
                            <CardHeader><CardTitle>Demandes de rendez-vous en attente</CardTitle></CardHeader>
                            <CardContent>
                                {isLoadingAppointments ? <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div> :
                                 pendingAppointments.length > 0 ? (
                                    <div className="space-y-4">
                                        {pendingAppointments.map(appt => (
                                            <div key={appt.id} className="p-4 border rounded-lg flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium">Patient: {appt.patient_name}</p>
                                                    <p className="text-sm text-muted-foreground">Date: {appt.appointment_date} à {appt.appointment_time}</p>
                                                    {appt.reason && <p className="text-sm italic text-muted-foreground mt-1">Raison: {appt.reason}</p>}
                                                </div>
                                                <div className="flex space-x-2">
                                                    <Button size="sm" onClick={() => handleStatusUpdate(appt.id, 'confirmed')} className="bg-green-600 hover:bg-green-700"><CheckCircle className="h-4 w-4 mr-1" /> Confirmer</Button>
                                                    <Button size="sm" variant="destructive" onClick={() => handleStatusUpdate(appt.id, 'rejected')}><X className="h-4 w-4 mr-1" /> Rejeter</Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : <p className="text-center py-4">Aucune demande de rendez-vous en attente.</p>}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="confirmed">
                        <Card>
                            <CardHeader><CardTitle>Rendez-vous confirmés et passés</CardTitle></CardHeader>
                            <CardContent>
                                {isLoadingAppointments ? <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div> :
                                 otherAppointments.length > 0 ? (
                                    <div className="space-y-4">
                                        {otherAppointments.map(appt => (
                                            <div key={appt.id} className="p-4 border rounded-lg flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium">Patient: {appt.patient_name}</p>
                                                    <p className="text-sm text-muted-foreground">{appt.appointment_date} à {appt.appointment_time}</p>
                                                </div>
                                                <Badge variant={appt.status === 'confirmed' ? 'default' : 'secondary'}>{appt.status}</Badge>
                                            </div>
                                        ))}
                                    </div>
                                ) : <p className="text-center py-4">Aucun autre rendez-vous.</p>}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

const SpecialistPage = () => {
    return (
        <HealthProvider>
            <div className="flex min-h-screen bg-background">
                <Sidebar />
                <SpecialistPageContent />
            </div>
        </HealthProvider>
    );
};

export default SpecialistPage;