import { Suspense } from 'react';
import DrillConfigurator from './DrillConfigurator';

function DrillConfiguratorFallback() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
      <div className="text-center space-y-2">
        <p className="text-lg font-semibold text-slate-900 dark:text-white">Loading Drill Configurator…</p>
        <p className="text-sm text-slate-500 dark:text-[#90a7cb]">Preparing toolpaths and patterns</p>
      </div>
    </div>
  );
}

export default function DrillConfiguratorPage() {
  return (
    <Suspense fallback={<DrillConfiguratorFallback />}>
      <DrillConfigurator />
    </Suspense>
  );
}
