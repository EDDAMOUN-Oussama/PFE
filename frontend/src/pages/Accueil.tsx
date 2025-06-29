
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Target, TrendingUp, Users } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Accueil() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-gray-900">HealthyTrack</h1>
            </div>
            <div className="flex space-x-4">
              <Link to="/login">
                <Button variant="outline">Se connecter</Button>
              </Link>
              <Link to="/register">
                <Button>S'inscrire</Button>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 sm:text-6xl">
              Votre compagnon santé
              <span className="text-primary"> personnel</span>
            </h2>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              Suivez votre poids, gérez votre nutrition, planifiez vos exercices et atteignez vos objectifs de santé 
              avec notre plateforme complète de suivi de bien-être.
            </p>
            <div className="mt-10 flex justify-center space-x-4">
              <Link to="/register">
                <Button size="lg" className="px-8">
                  Commencer
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="px-8">
                  J'ai déjà un compte
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900">
              Tout ce dont vous avez besoin pour rester en forme
            </h3>
            <p className="mt-4 text-xl text-gray-600">
              Une solution complète pour votre parcours de santé et de bien-être
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Suivi du poids</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Surveillez votre progression avec des graphiques détaillés et des analyses de tendances.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Activity className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Gestion nutrition</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Planifiez vos repas et suivez vos calories pour maintenir une alimentation équilibrée.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Objectifs personnalisés</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Définissez et atteignez vos objectifs de santé avec un suivi personnalisé.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Consultations</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Planifiez des rendez-vous avec des professionnels de santé directement depuis l'app.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Image Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Prenez le contrôle de votre santé
              </h3>
              <p className="text-lg text-gray-600 mb-8">
                HealthyTrack vous accompagne dans votre parcours de bien-être avec des outils 
                intelligents et une interface intuitive. Que vous souhaitiez perdre du poids, 
                gagner en muscle ou simplement maintenir une vie saine, nous avons les 
                fonctionnalités qu'il vous faut.
              </p>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  Suivi automatique de vos métriques de santé
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  Rappels personnalisés pour vos objectifs
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  Rapports détaillés de vos progrès
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  Interface simple et élégante
                </li>
              </ul>
            </div>
            <div className="relative">
              <img
                src="/img1.png"
                alt="Personne utilisant une application de fitness"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-white mb-6">
            Prêt à commencer votre parcours santé ?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Rejoignez des milliers d'utilisateurs qui ont déjà transformé leur vie avec HealthyTrack
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/register">
              <Button size="lg" variant="secondary" className="px-8">
                Créer mon compte
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="px-8 text-white border-white hover:bg-white hover:text-primary">
                Se connecter
              </Button>
            </Link>
          </div>
        </div>
      </section>
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center">
          <img src="/favicon.ico" alt="HealthyTrack Logo" className="h-12 w-12 mb-4" />
          <span className="text-2xl font-extrabold tracking-wide">HealthyTrack</span>
        </div>
      </div>
    </footer>  </div>
  );
}
