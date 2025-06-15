
import { ReactNode } from 'react';
import { useI18n } from '@/contexts/I18nContext';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  const { t } = useI18n();
  
  return (
    <div className="flex min-h-screen bg-background">
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold tracking-tight">{title}</h2>
            {subtitle && (
              <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {children}
        </div>
      </div>
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-r from-purple-400 to-indigo-600">
        <div className="flex h-full items-center justify-center p-12">
          <div className="max-w-lg">
            <h1 className="text-4xl font-bold text-white mb-6">{t('auth.healthyTrack')}</h1>
            <p className="text-white/80 text-lg">
              {t('auth.healthCompanion')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
