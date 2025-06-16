
import { useState } from 'react';
import { HealthProvider } from '@/contexts/HealthContext';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Clock, CheckCircle, User, Stethoscope, AlertCircle } from 'lucide-react';

const SpecialistPage = () => {
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [response, setResponse] = useState('');

  // Mock data for questions and requests
  const pendingQuestions = [
    {
      id: 1,
      patientName: "Marie Dubois",
      patientAge: 28,
      question: "J'ai des douleurs abdominales depuis 3 jours. Que dois-je faire ?",
      timestamp: "2025-01-15 14:30",
      urgency: "medium",
      category: "Digestif"
    },
    {
      id: 2,
      patientName: "Pierre Martin",
      patientAge: 45,
      question: "Mon taux de cholestérol est élevé (2.8g/L). Dois-je modifier mon alimentation ?",
      timestamp: "2025-01-15 12:15",
      urgency: "low",
      category: "Cardiologie"
    },
    {
      id: 3,
      patientName: "Sophie Lefèvre",
      patientAge: 35,
      question: "Enceinte de 8 mois, j'ai des contractions irrégulières. Est-ce normal ?",
      timestamp: "2025-01-15 16:45",
      urgency: "high",
      category: "Gynécologie"
    }
  ];

  const respondedQuestions = [
    {
      id: 4,
      patientName: "Jean Dupont",
      patientAge: 52,
      question: "Comment réduire ma tension artérielle naturellement ?",
      response: "Je recommande une alimentation pauvre en sel, de l'exercice régulier (30min/jour), et un suivi médical. Consultez votre médecin traitant pour un ajustement éventuel du traitement.",
      timestamp: "2025-01-14 10:20",
      responseTime: "2025-01-14 11:15",
      category: "Cardiologie"
    }
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'Urgent';
      case 'medium': return 'Modéré';
      case 'low': return 'Faible';
      default: return 'Normal';
    }
  };

  const handleSendResponse = () => {
    if (response.trim() && selectedQuestion) {
      // Here you would send the response to the backend
      console.log('Sending response:', { questionId: selectedQuestion.id, response });
      setResponse('');
      setSelectedQuestion(null);
      // You could also update the questions list to move the question to "responded"
    }
  };

  return (
    <HealthProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        
        <div className="flex-1 ml-64">
          <div className="container p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold flex items-center">
                  <Stethoscope className="mr-3 h-8 w-8 text-primary" />
                  Espace Spécialiste
                </h1>
                <p className="text-muted-foreground mt-2">Gérez les demandes et questions de vos patients</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{pendingQuestions.length}</p>
                  <p className="text-sm text-muted-foreground">En attente</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{respondedQuestions.length}</p>
                  <p className="text-sm text-muted-foreground">Traitées</p>
                </div>
              </div>
            </div>

            <Tabs defaultValue="pending" className="space-y-6">
              <TabsList>
                <TabsTrigger value="pending" className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  Questions en attente ({pendingQuestions.length})
                </TabsTrigger>
                <TabsTrigger value="responded" className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Questions traitées ({respondedQuestions.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Questions en attente de réponse</h3>
                    {pendingQuestions.map((question) => (
                      <Card 
                        key={question.id} 
                        className={`cursor-pointer transition-colors ${selectedQuestion?.id === question.id ? 'border-primary' : 'hover:border-muted-foreground'}`}
                        onClick={() => setSelectedQuestion(question)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{question.patientName}</span>
                              <span className="text-sm text-muted-foreground">({question.patientAge} ans)</span>
                            </div>
                            <Badge className={getUrgencyColor(question.urgency)}>
                              {getUrgencyText(question.urgency)}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline">{question.category}</Badge>
                            <span className="text-xs text-muted-foreground">{question.timestamp}</span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">{question.question}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="space-y-4">
                    {selectedQuestion ? (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <MessageSquare className="mr-2 h-5 w-5" />
                            Répondre à {selectedQuestion.patientName}
                          </CardTitle>
                          <CardDescription>
                            Question: {selectedQuestion.question}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <Textarea
                            placeholder="Saisissez votre réponse médicale..."
                            value={response}
                            onChange={(e) => setResponse(e.target.value)}
                            rows={6}
                          />
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setSelectedQuestion(null)}>
                              Annuler
                            </Button>
                            <Button onClick={handleSendResponse} disabled={!response.trim()}>
                              Envoyer la réponse
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card>
                        <CardContent className="flex items-center justify-center h-64">
                          <div className="text-center">
                            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">Sélectionnez une question pour y répondre</p>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="responded" className="space-y-4">
                <h3 className="text-lg font-semibold">Questions déjà traitées</h3>
                {respondedQuestions.map((question) => (
                  <Card key={question.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{question.patientName}</span>
                          <span className="text-sm text-muted-foreground">({question.patientAge} ans)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{question.category}</Badge>
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Traitée
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Question:</p>
                        <p className="text-sm">{question.question}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Votre réponse:</p>
                        <p className="text-sm bg-muted/30 p-3 rounded-md">{question.response}</p>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Question reçue: {question.timestamp}</span>
                        <span>Réponse envoyée: {question.responseTime}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </HealthProvider>
  );
};

export default SpecialistPage;
