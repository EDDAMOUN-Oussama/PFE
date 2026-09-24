import { lazy, Suspense } from 'react';
import { HealthProvider, useHealth } from '@/contexts/HealthContext';
import Sidebar from '@/components/Sidebar';

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { I18nProvider } from "@/contexts/I18nContext";
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const WeightPage = lazy(() => import("./pages/Weight"));
const NutritionPage = lazy(() => import("./pages/Nutrition"));
const ExercisesPage = lazy(() => import("./pages/Exercises"));
const GoalsPage = lazy(() => import("./pages/Goals"));
const ReportsPage = lazy(() => import("./pages/Reports"));
const AppointmentsPage = lazy(() => import("./pages/Appointments"));
const ProfilePage = lazy(() => import("./pages/Profile"));
const SettingsPage = lazy(() => import("./pages/Settings"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const AdminPage = lazy(() => import("./pages/Admin"));
const NotificationsPage = lazy(() => import("./pages/Notifications"));
const SpecialistPage = lazy(() => import("./pages/Specialist"));
const Accueil = lazy(() => import("./pages/Accueil"));

const queryClient = new QueryClient();

function ProtectedLayout() {
  const { user, isLoading, error, refetchUser } = useHealth();
  if (isLoading) return <p className="p-8" role="status">Chargement...</p>;
  if (error) return <div className="p-8"><p role="alert">{error}</p><button onClick={() => void refetchUser()}>Reessayer</button></div>;
  if (!user) return <Navigate to="/login" replace />;
  return <><Sidebar /><Outlet /></>;
}
const App = () => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <HealthProvider>
            <Suspense fallback={<p className="p-6" role="status">Chargement...</p>}>
            <Routes>
              {/* Redirect root to accueil */}
              <Route path="/" element={<Accueil />} />

              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* App Routes */}
              <Route element={<ProtectedLayout />}>
              <Route path="/dashboard" element={<Index />} />
              <Route path="/weight" element={<WeightPage />} />
              <Route path="/nutrition" element={<NutritionPage />} />
              <Route path="/exercises" element={<ExercisesPage />} />
              <Route path="/goals" element={<GoalsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/appointments" element={<AppointmentsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/specialist" element={<SpecialistPage />} />

              </Route>
              {/* Catch-all Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            </Suspense>
            </HealthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </I18nProvider>
  </QueryClientProvider>
);

export default App;
