import { useEffect } from 'react';

const OpenDashboardHtml: React.FC = () => {
  useEffect(() => {
    window.location.replace('/dashboard.html');
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h1 className="text-2xl font-bold text-slate-900">Abrindo Dashboard HTML...</h1>
      <p className="text-slate-500 mt-2">Se não redirecionar, acesse /dashboard.html manualmente.</p>
    </div>
  );
};

export default OpenDashboardHtml;