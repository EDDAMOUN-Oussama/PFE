
import { HealthProvider, useHealth } from '@/contexts/HealthContext';
import { useI18n } from '@/contexts/I18nContext';
import WeightTracker from '@/components/weight/WeightTracker';
import AddWeightEntry from '@/components/weight/AddWeightEntry';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const WeightPageContent = () => {
  const { t } = useI18n();

  return (
    <div className="app-content">
      <div className="container p-6">
        <h1 className="text-3xl font-bold mb-6">Suivi du poids</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <WeightTracker />
          </div>
          <div>
            <AddWeightEntry />
          </div>
        </div>
      </div>
    </div>
  );
};

const WeightPage = () => {
  return (
    <HealthProvider>
      <div className="flex min-h-screen bg-background">

        <WeightPageContent />
      </div>
    </HealthProvider>
  );
};

export default WeightPage;
