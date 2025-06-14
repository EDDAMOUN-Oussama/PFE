import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'fr';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'ltr';
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// French translations only
const translations = {
  fr: {
    // Navigation
    'nav.dashboard': 'Tableau de bord',
    'nav.weight': 'Poids',
    'nav.nutrition': 'Nutrition',
    'nav.exercises': 'Exercices',
    'nav.goals': 'Objectifs',
    'nav.reports': 'Rapports',
    'nav.appointments': 'Rendez-vous',
    'nav.profile': 'Profil',
    'nav.settings': 'Paramètres',
    'nav.notifications': 'Notifications',
    'nav.admin': 'Administration',
    
    // Dashboard
    'dashboard.hello': 'Bonjour',
    'dashboard.weightGoal': 'Objectif de poids',
    'dashboard.exerciseMinutes': "Minutes d'exercice",
    'dashboard.caloriesConsumed': 'Calories consommées',
    'dashboard.waterIntake': "Consommation d'eau",
    'dashboard.weeklyProgress': 'Progrès hebdomadaire',
    'dashboard.todaysCalories': "Calories d'aujourd'hui",
    'dashboard.recentExercises': 'Exercices récents',
    'dashboard.goalProgress': 'Progrès des objectifs',
    'dashboard.currentWeight': 'Poids actuel',
    'dashboard.goalWeight': 'Poids objectif',
    'dashboard.weightEvolution': 'Évolution du poids',
    'dashboard.last14Days': '14 derniers jours',
    'dashboard.globalEvolution': 'Évolution globale',
    'dashboard.remaining': 'restants',
    'dashboard.goalsProgress': 'Objectifs et Progrès',
    'dashboard.todaysExercise': "Exercice d'aujourd'hui",
    'dashboard.todaysNutrition': "Nutrition d'aujourd'hui",
    'dashboard.weightGoalTitle': 'Objectif de Poids',
    'dashboard.dailyCalories': 'Calories Quotidiennes',
    'dashboard.weeklyExercise': 'Exercice Hebdomadaire',
    'dashboard.toGoal': 'vers objectif',
    'dashboard.completed': 'terminé',
    'dashboard.targetDate': 'Date cible',
    'dashboard.logExercise': 'Enregistrer exercice',
    'dashboard.noExercisesToday': "Aucun exercice enregistré aujourd'hui",
    'dashboard.addFirstExercise': 'Ajouter votre premier exercice',
    'dashboard.totalDuration': 'Durée totale',
    'dashboard.caloriesBurned': 'Calories brûlées',
    'dashboard.addFood': 'Ajouter nourriture',
    'dashboard.consumed': 'Consommées',
    'dashboard.goal': 'Objectif',
    'dashboard.protein': 'Protéines',
    'dashboard.carbs': 'Glucides',
    'dashboard.fat': 'Lipides',
    'dashboard.todaysMeals': "Repas d'aujourd'hui",
    'dashboard.noMealsToday': "Aucun repas enregistré aujourd'hui",
    'dashboard.weight': 'Poids',
    'dashboard.caloriesConsumedTitle': 'Calories Consommées',
    'dashboard.caloriesBurnedTitle': 'Calories Brûlées',
    'dashboard.netCalories': 'Calories Nettes',
    'dashboard.maintaining': 'Maintien',
    'dashboard.minutesActive': 'minutes actives',
    'dashboard.calorieDeficit': 'Déficit calorique',
    'dashboard.calorieSurplus': 'Excédent calorique',
    
    // Weight
    'weight.title': 'Suivi du poids',
    'weight.addEntry': 'Ajouter une entrée de poids',
    'weight.weightKg': 'Poids (kg)',
    'weight.date': 'Date',
    'weight.addWeightEntry': 'Ajouter une entrée de poids',
    'weight.tips': 'Conseils pour la pesée :',
    'weight.tip1': '• Pesez-vous à la même heure chaque jour',
    'weight.tip2': '• Utilisez la même balance pour des mesures cohérentes',
    'weight.tip3': '• Suivez votre poids régulièrement pour de meilleurs insights',
    'weight.enterWeight': 'Entrez le poids',
    
    // Auth
    'auth.welcomeBack': 'Bon retour',
    'auth.signInCredentials': 'Veuillez entrer vos identifiants pour vous connecter',
    'auth.email': 'Email',
    'auth.password': 'Mot de passe',
    'auth.forgotPassword': 'Mot de passe oublié ?',
    'auth.signIn': 'Se connecter',
    'auth.noAccount': "Vous n'avez pas de compte ?",
    'auth.signUp': "S'inscrire",
    'auth.healthCompanion': 'Votre compagnon santé personnel. Suivez votre poids, votre nutrition et vos exercices pour atteindre vos objectifs de santé.',
    'auth.healthyTrack': 'HealthyTrack',
    'auth.resetPasswordTitle': 'Créer un nouveau mot de passe',
    'auth.resetPasswordSubtitle': 'Entrez votre nouveau mot de passe ci-dessous',
    'auth.newPassword': 'Nouveau mot de passe',
    'auth.confirmNewPassword': 'Confirmer le nouveau mot de passe',
    'auth.resetPassword': 'Réinitialiser le mot de passe',
    'auth.rememberPassword': 'Vous vous souvenez de votre mot de passe ?',
    'auth.backToLogin': 'Retour à la connexion',
    'auth.passwordMustBe8': 'Le mot de passe doit contenir au moins 8 caractères',
    'auth.passwordsDontMatch': 'Les mots de passe ne correspondent pas',
    'auth.showPassword': 'Afficher le mot de passe',
    'auth.hidePassword': 'Masquer le mot de passe',
    
    // Profile
    'profile.title': 'Mon Profil',
    'profile.memberSince': 'Membre depuis',
    'profile.yearsOld': 'ans',
    'profile.moderateActivity': 'Niveau d\'activité modéré',
    'profile.editProfile': 'Modifier le profil',
    'profile.healthInfo': 'Informations de santé',
    'profile.healthInfoDesc': 'Vos métriques actuelles et données de santé',
    'profile.bodyMetrics': 'Métriques corporelles',
    'profile.currentWeight': 'Poids actuel',
    'profile.goalWeight': 'Poids objectif',
    'profile.height': 'Taille',
    'profile.nutritionGoals': 'Objectifs nutritionnels',
    'profile.dailyCalorieGoal': 'Objectif calorique quotidien',
    'profile.adjustGoals': 'Ajuster les objectifs',
    'profile.customizeTargets': 'Personnaliser vos objectifs nutritionnels',
    'profile.configure': 'Configurer',
    'profile.viewHealthHistory': 'Voir l\'historique de santé',
    'profile.updateHealthProfile': 'Mettre à jour le profil de santé',
    'profile.accountSettings': 'Paramètres du compte',
    'profile.notificationPreferences': 'Préférences de notification',
    'profile.notificationPreferencesDesc': 'Gérer comment et quand vous recevez les notifications',
    'profile.privacySettings': 'Paramètres de confidentialité',
    'profile.privacySettingsDesc': 'Contrôler quelles informations sont partagées avec d\'autres',
    'profile.connectedDevices': 'Appareils connectés',
    'profile.connectedDevicesDesc': 'Lier des trackers de fitness et appareils de santé',
    'profile.manage': 'Gérer',
    'profile.addDevice': 'Ajouter un appareil',
    'profile.kcal': 'kcal',
    'profile.kg': 'kg',
    'profile.cm': 'cm',
    
    // Appointments
    'appointments.title': 'Rendez-vous',
    'appointments.upcoming': 'Rendez-vous à venir',
    'appointments.upcomingDesc': 'Vos prochains rendez-vous médicaux',
    'appointments.schedule': 'Planifier un rendez-vous',
    'appointments.scheduleDesc': 'Réserver un nouveau rendez-vous',
    'appointments.history': 'Historique',
    'appointments.historyDesc': 'Voir vos rendez-vous passés',
    'appointments.doctorConsultation': 'Consultation médecin',
    'appointments.nutritionistConsult': 'Consultation nutritionniste',
    'appointments.bloodTest': 'Prise de sang',
    'appointments.confirmed': 'Confirmé',
    'appointments.pending': 'En attente',
    'appointments.completed': 'Terminé',
    'appointments.reschedule': 'Reporter',
    'appointments.cancel': 'Annuler',
    'appointments.viewDetails': 'Voir détails',
    'appointments.noUpcoming': 'Aucun rendez-vous à venir',
    'appointments.scheduleFirst': 'Planifiez votre premier rendez-vous',
    'appointments.newAppointment': 'Nouveau rendez-vous',
    'appointments.with': 'avec',
    'appointments.at': 'à',
    
    // Admin
    'admin.title': 'Administration',
    'admin.userManagement': 'Gestion des utilisateurs',
    'admin.userManagementDesc': 'Gérer les comptes utilisateurs et permissions',
    'admin.systemStats': 'Statistiques système',
    'admin.systemStatsDesc': 'Vue d\'ensemble des métriques du système',
    'admin.totalUsers': 'Utilisateurs totaux',
    'admin.activeUsers': 'Utilisateurs actifs',
    'admin.newRegistrations': 'Nouvelles inscriptions',
    'admin.systemHealth': 'Santé du système',
    'admin.recentActivity': 'Activité récente',
    'admin.recentActivityDesc': 'Actions récentes des utilisateurs',
    'admin.userRegistered': 'Utilisateur inscrit',
    'admin.profileUpdated': 'Profil mis à jour',
    'admin.goalSet': 'Objectif défini',
    'admin.exerciseLogged': 'Exercice enregistré',
    'admin.appointmentScheduled': 'Rendez-vous planifié',
    'admin.ago': 'il y a',
    'admin.minutes': 'minutes',
    'admin.hours': 'heures',
    'admin.hour': 'heure',
    'admin.days': 'jours',
    'admin.day': 'jour',
    'admin.manageUsers': 'Gérer les utilisateurs',
    'admin.viewReports': 'Voir les rapports',
    'admin.systemSettings': 'Paramètres système',
    'admin.excellent': 'Excellent',
    'admin.thisMonth': 'Ce mois-ci',
    'admin.today': 'Aujourd\'hui',
    
    // Settings
    'settings.title': 'Paramètres',
    'settings.notifications': 'Notifications',
    'settings.notificationsDesc': 'Configurez comment vous recevez les notifications',
    'settings.emailNotifications': 'Notifications par email',
    'settings.emailNotificationsDesc': 'Recevez des emails sur votre activité et vos progrès',
    'settings.pushNotifications': 'Notifications push',
    'settings.pushNotificationsDesc': 'Recevez des notifications directement sur votre appareil',
    'settings.dailyReminders': 'Rappels quotidiens',
    'settings.dailyRemindersDesc': 'Recevez des rappels pour enregistrer vos données de santé quotidiennes',
    'settings.accountSettings': 'Paramètres du compte',
    'settings.accountSettingsDesc': 'Gérez les préférences de votre compte',
    'settings.changePassword': 'Changer le mot de passe',
    'settings.changePasswordDesc': 'Mettez à jour le mot de passe de votre compte',
    'settings.emailAddress': 'Adresse email',
    'settings.deleteAccount': 'Supprimer le compte',
    'settings.deleteAccountDesc': 'Supprimez définitivement votre compte et toutes les données',
    'settings.privacy': 'Confidentialité et sécurité',
    'settings.privacyDesc': 'Gérez vos préférences de confidentialité',
    'settings.dataSharing': 'Partage de données',
    'settings.dataSharingDesc': 'Partagez des données anonymisées pour améliorer nos services',
    'settings.twoFactorAuth': 'Authentification à deux facteurs',
    'settings.twoFactorAuthDesc': 'Ajoutez une couche de sécurité supplémentaire à votre compte',
    'settings.appearance': 'Apparence',
    'settings.appearanceDesc': "Personnalisez le thème de l'application",
    'settings.regional': 'Paramètres régionaux',
    'settings.language': 'Langue',
    'settings.units': 'Unités',
    'settings.connectedDevices': 'Appareils connectés',
    'settings.connectedDevicesDesc': "Aucun appareil connecté pour le moment. Connectez un tracker de fitness ou une balance intelligente pour synchroniser automatiquement vos données de santé.",
    'settings.connectDevice': 'Connecter un appareil',
    
    // Theme
    'theme.light': 'Clair',
    'theme.dark': 'Sombre',
    'theme.system': 'Système',
    'theme.lightDesc': 'Utiliser le thème clair',
    'theme.darkDesc': 'Utiliser le thème sombre',
    'theme.systemDesc': 'Suivre les paramètres du système',
    
    // Buttons
    'button.update': 'Mettre à jour',
    'button.change': 'Changer',
    'button.delete': 'Supprimer',
    'button.settings': 'Paramètres',
    'button.edit': 'Modifier',
    'button.save': 'Sauvegarder',
    'button.cancel': 'Annuler',
    'button.confirm': 'Confirmer',
    'button.close': 'Fermer',
    
    // Units
    'units.metric': 'Métrique (kg, cm)',
    'units.imperial': 'Impérial (lb, in)',
    
    // Languages
    'lang.french': 'Français',
    
    // Notifications Page
    'notifications.title': 'Notifications',
    'notifications.allCaughtUp': 'Tout est à jour !',
    'notifications.unreadCount': 'notifications non lues',
    'notifications.total': 'Total',
    'notifications.allNotifications': 'Toutes les notifications',
    'notifications.exercise': 'Exercice',
    'notifications.exerciseReminders': "Rappels d'exercice",
    'notifications.unread': 'Non lu',
    'notifications.needAttention': 'Nécessite une attention',
    'notifications.today': "Aujourd'hui",
    'notifications.todaysReminders': "Rappels d'aujourd'hui",
    'notifications.recent': 'Notifications récentes',
    'notifications.recentDesc': 'Restez au top de vos objectifs de fitness',
    'notifications.snooze': 'Reporter',
    'notifications.markAsRead': 'Marquer comme lu',
    'notifications.dismiss': 'Ignorer',
    'notifications.workoutTime': 'Heure d\'entraînement !',
    'notifications.strengthTraining': 'Vous aviez prévu de faire de la musculation à 18h00 aujourd\'hui.',
    'notifications.morningRun': 'Rappel course matinale',
    'notifications.morningRunDesc': 'N\'oubliez pas votre course de 30 minutes ce matin.',
    'notifications.weeklyGoal': 'Progression objectif hebdomadaire',
    'notifications.weeklyGoalDesc': 'Vous êtes à 80% de votre objectif d\'exercice hebdomadaire !',
    'notifications.yogaSession': 'Séance de yoga',
    'notifications.yogaSessionDesc': 'C\'est l\'heure de votre séance de yoga du soir.',
    'notifications.minutesAgo': 'minutes',
    'notifications.hourAgo': 'heure',
    'notifications.hoursAgo': 'heures',
    'notifications.dayAgo': 'jour',
    'notifications.daysAgo': 'jours',
    
    // Time
    'time.ago': 'il y a',
    'time.minutes': 'minutes',
    'time.hour': 'heure',
    'time.hours': 'heures',
    'time.day': 'jour',
    'time.days': 'jours',
    
    // Common
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    'common.warning': 'Attention',
    'common.info': 'Information',
    'common.noData': 'Aucune donnée disponible',
    'common.search': 'Rechercher',
    'common.filter': 'Filtrer',
    'common.sort': 'Trier',
    'common.actions': 'Actions',
    'common.status': 'Statut',
    'common.date': 'Date',
    'common.time': 'Heure',
    'common.name': 'Nom',
    'common.email': 'Email',
    'common.phone': 'Téléphone',
    'common.address': 'Adresse'
  }
};

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language] = useState<Language>('fr');

  useEffect(() => {
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = 'fr';
  }, []);

  const t = (key: string): string => {
    return translations.fr[key] || key;
  };

  const setLanguage = () => {
    // No-op since we only support French
  };

  const dir = 'ltr';

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </I18nContext.Provider>
  );
}

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
