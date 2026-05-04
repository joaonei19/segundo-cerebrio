import React, { useState, useEffect } from 'react';
import { RefreshCw, AlertCircle, Check, TrendingUp, Calendar } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DashboardData {
  period: string;
  metrics: Record<string, any>[];
  summary: {
    total: number;
    average: number;
    status: string;
    lastUpdated: string;
  };
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [xlsPath, setXlsPath] = useState<string>('');
  const [showPathInput, setShowPathInput] = useState(false);

  // Carrega dados do XLS
  const loadDashboardData = async () => {
    if (!xlsPath) {
      setError('Por favor, informe o caminho do arquivo XLS');
      setShowPathInput(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/dashboard/xls?filePath=${encodeURIComponent(xlsPath)}`);
      
      if (!response.ok) {
        throw new Error(`Erro ao carregar dados: ${response.statusText}`);
      }

      const dashboardData: DashboardData = await response.json();
      setData(dashboardData);
      
      // Salva o caminho no localStorage para próximas vezes
      localStorage.setItem('xls-path', xlsPath);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar dados do XLS');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  // Carrega caminho salvo no localStorage
  useEffect(() => {
    const savedPath = localStorage.getItem('xls-path');
    if (savedPath) {
      setXlsPath(savedPath);
    }
  }, []);

  // Auto-load se tiver caminho salvo
  useEffect(() => {
    if (xlsPath && !data) {
      loadDashboardData();
    }
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-2">
            {data ? `Período: ${data.period}` : 'Carregue um arquivo XLS para começar'}
          </p>
        </div>

        <div className="flex gap-3">
          {showPathInput && (
            <div className="flex gap-2">
              <input
                type="text"
                value={xlsPath}
                onChange={(e) => setXlsPath(e.target.value)}
                placeholder="C:/Users/Joao/dados.xlsx"
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={() => setShowPathInput(false)}
                className="px-3 py-2 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
              >
                ✕
              </button>
            </div>
          )}

          <button
            onClick={() => setShowPathInput(!showPathInput)}
            className="px-4 py-2 text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition"
          >
            📁 Caminho
          </button>

          <button
            onClick={loadDashboardData}
            disabled={loading || !xlsPath}
            className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 flex items-center gap-2"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Carregando...' : 'Atualizar'}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-gap-3">
          <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-1" />
          <div>
            <p className="font-medium text-red-800">{error}</p>
            <p className="text-sm text-red-700 mt-1">
              Verifique se o caminho do arquivo está correto. Exemplo: <code className="bg-red-100 px-2 py-1 rounded">C:/Users/Joao/dados.xlsx</code>
            </p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <RefreshCw className="animate-spin mx-auto mb-2 text-blue-600" size={24} />
          <p className="text-blue-700 font-medium">Carregando dados...</p>
        </div>
      )}

      {/* Main Content */}
      {data && !loading && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Total</p>
                  <p className="text-2xl font-bold text-slate-900">{data.summary.total.toLocaleString('pt-BR')}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                  <Check size={24} />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Média</p>
                  <p className="text-2xl font-bold text-slate-900">{data.summary.average.toLocaleString('pt-BR')}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                  <Calendar size={24} />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Registros</p>
                  <p className="text-2xl font-bold text-slate-900">{data.metrics.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
                  <AlertCircle size={24} />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Status</p>
                  <p className="text-lg font-bold text-slate-900">{data.summary.status}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="font-semibold text-lg text-slate-800">Dados do Período</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    {data.metrics.length > 0 && Object.keys(data.metrics[0]).map((key) => (
                      <th key={key} className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {data.metrics.map((metric, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition">
                      {Object.values(metric).map((value: any, i) => (
                        <td key={i} className="px-6 py-3 text-sm text-slate-700">
                          {typeof value === 'number' ? value.toLocaleString('pt-BR') : String(value)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Charts Section */}
          {data.metrics.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Bar Chart - if numeric data exists */}
              {hasNumericData(data.metrics) && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <h3 className="font-semibold text-lg text-slate-800 mb-4">Distribuição de Dados</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data.metrics.slice(0, 10)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey={Object.keys(data.metrics[0])[0]} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey={getFirstNumericKey(data.metrics[0])} fill="#4F46E5" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Summary Stats */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-semibold text-lg text-slate-800 mb-4">Resumo Executivo</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-600">Total de Registros</span>
                    <span className="font-bold text-slate-900">{data.metrics.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-600">Valor Total</span>
                    <span className="font-bold text-slate-900">{data.summary.total.toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-600">Média por Registro</span>
                    <span className="font-bold text-slate-900">{data.summary.average.toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
                    <span className="text-indigo-600 font-medium">Última Atualização</span>
                    <span className="font-bold text-indigo-700">
                      {new Date(data.summary.lastUpdated).toLocaleString('pt-BR')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {data.metrics.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
              <AlertCircle size={32} className="mx-auto mb-2 text-yellow-600" />
              <p className="text-yellow-700 font-medium">Nenhum dado encontrado no arquivo</p>
              <p className="text-sm text-yellow-600 mt-1">Verifique se o arquivo XLS possui dados preenchidos</p>
            </div>
          )}
        </>
      )}

      {/* Initial State */}
      {!data && !loading && !error && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-12 text-center">
          <Calendar size={48} className="mx-auto mb-4 text-slate-400" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">Bem-vindo ao Dashboard Dinâmico</h3>
          <p className="text-slate-600 mb-6">
            Carregue um arquivo XLS/XLSX para começar. O dashboard se atualizará automaticamente a cada 15 dias.
          </p>
          <button
            onClick={() => setShowPathInput(true)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
          >
            Carregar Arquivo XLS
          </button>
        </div>
      )}
    </div>
  );
};

// Helpers
function hasNumericData(metrics: Record<string, any>[]): boolean {
  if (metrics.length === 0) return false;
  return Object.values(metrics[0]).some(v => typeof v === 'number');
}

function getFirstNumericKey(obj: Record<string, any>): string {
  return Object.entries(obj).find(([_, v]) => typeof v === 'number')?.[0] || Object.keys(obj)[0];
}

export default Dashboard;
