import { useState, useEffect } from 'react';
import { HealthProvider, useHealth } from '@/contexts/HealthContext';
import { useI18n } from '@/contexts/I18nContext';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, Stethoscope, Plus, MoreHorizontal, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

// --- Formulaire de Nouveau Rendez-vous ---
const NewAppointmentForm = ({ onSubmit, onCancel }) => {
    const [specialists, setSpecialists] = useState([]);
    const [formData, setFormData] = useState({ specialist_id: '', appointment_date: '', appointment_time: '', reason: '', type: 'consultation' });

    useEffect(() => {
        const fetchSpecialists = async () => {
            try {
                const response = await fetch('http://localhost/pfe/PFE/backend/controllers/getSpecialists.php');
                const data = await response.json();
                if (data.success) {
                    setSpecialists(data.specialists);
                }
            } catch (error) {
                toast.error("Impossible de charger la liste des spécialistes.");
            }
        };
        fetchSpecialists();
    }, []);

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleSelectChange = (value) => setFormData(prev => ({ ...prev, specialist_id: value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.specialist_id || !formData.appointment_date || !formData.appointment_time) {
            toast.error("Veuillez remplir tous les champs obligatoires.");
            return;
        }
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div>
                <Label htmlFor="specialist_id">Spécialiste</Label>
                <Select onValueChange={handleSelectChange} value={formData.specialist_id}>
                    <SelectTrigger><SelectValue placeholder="Sélectionnez un spécialiste" /></SelectTrigger>
                    <SelectContent>
                        {specialists.map(specialist => (
                            <SelectItem key={specialist.id} value={specialist.id.toString()}>{specialist.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="appointment_date">Date du rendez-vous</Label>
                <Input type="date" name="appointment_date" value={formData.appointment_date} onChange={handleChange} />
            </div>
            <div>
                <Label htmlFor="appointment_time">Heure du rendez-vous</Label>
                <Input type="time" name="appointment_time" value={formData.appointment_time} onChange={handleChange} />
            </div>
            <div>
                <Label htmlFor="reason">Raison de la consultation (optionnel)</Label>
                <Textarea name="reason" value={formData.reason} onChange={handleChange} placeholder="Décrivez brièvement la raison de votre visite..." />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="ghost" onClick={onCancel}>Annuler</Button>
                <Button type="submit">Prendre rendez-vous</Button>
            </div>
        </form>
    );
};

// --- Contenu de la Page de Rendez-vous ---
const AppointmentsPageContent = () => {
    const { user, isLoading: isUserLoading } = useHealth();
    const { t } = useI18n();
    const [appointments, setAppointments] = useState([]);
    const [isLoadingAppointments, setIsLoadingAppointments] = useState(true);
    const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);

    const fetchAppointments = async () => {
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
        fetchAppointments();
    }, [user]);

    const handleNewAppointmentSubmit = async (formData) => {
        if (!user) return;
        try {
            const response = await fetch('http://localhost/pfe/PFE/backend/controllers/createAppointment.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, patient_id: user.id }),
            });
            const result = await response.json();
            if (result.success) {
                toast.success("Demande de rendez-vous envoyée !");
                setIsNewAppointmentOpen(false);
                fetchAppointments(); // Rafraîchir la liste
            } else {
                toast.error(`Erreur : ${result.message}`);
            }
        } catch (error) {
            toast.error("Une erreur de connexion est survenue.");
        }
    };

    if (isUserLoading) {
        return <div className="flex-1 ml-64 flex items-center justify-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <div className="flex-1 ml-64">
            <div className="container p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold">{t('appointments.title')}</h1>
                    <Dialog open={isNewAppointmentOpen} onOpenChange={setIsNewAppointmentOpen}>
                        <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" /> Nouveau rendez-vous</Button></DialogTrigger>
                        <DialogContent><DialogHeader><DialogTitle>Nouveau rendez-vous</DialogTitle></DialogHeader><NewAppointmentForm onSubmit={handleNewAppointmentSubmit} onCancel={() => setIsNewAppointmentOpen(false)} /></DialogContent>
                    </Dialog>
                </div>
                <Card>
                    <CardHeader><CardTitle>{t('appointments.upcoming')}</CardTitle><CardDescription>{t('appointments.upcomingDesc')}</CardDescription></CardHeader>
                    <CardContent>
                        {isLoadingAppointments ? <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div> :
                         appointments.length > 0 ? (
                            <div className="space-y-4">
                                {appointments.map((appointment) => (
                                    <div key={appointment.id} className="p-4 border rounded-lg flex items-center justify-between">
                                        <div>
                                            <h4 className="font-medium">{appointment.type === 'consultation' ? 'Consultation' : appointment.type}</h4>
                                            <p className="text-sm text-muted-foreground">Avec {appointment.specialist_name}</p>
                                            <div className="flex items-center text-sm text-muted-foreground mt-1"><Calendar className="h-4 w-4 mr-1" />{appointment.appointment_date} à {appointment.appointment_time}</div>
                                        </div>
                                        <div><Badge>{appointment.status}</Badge></div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8"><p>Vous n'avez aucun rendez-vous à venir.</p></div>
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