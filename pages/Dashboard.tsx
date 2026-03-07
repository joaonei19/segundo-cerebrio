import React from 'react';
import { KnowledgeItem, Area } from '../types';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { ArrowRight, CheckCircle2, AlertTriangle, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardProps {
  projects: KnowledgeItem[]; // Passed as projects filtered from items
  areas: Area[];
}

const Dashboard: React.FC<DashboardProps> = ({ projects, areas }) => {
  const activeProjects = projects.filter(p => p.status === 'Active');
  
  // Safe Reduce
  const completedTasksCount = projects.reduce((acc, p) => acc + (p.tasks?.filter(t => t.completed).length || 0), 0);
  const totalTasksCount = projects.reduce((acc, p) => acc + (p.tasks?.length || 0), 0);
  
  const completionRate = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  const projectStatusData = [
    { name: 'Active', value: activeProjects.length, color: '#4F46E5' },
    { name: 'On Hold', value: projects.filter(p => p.status === 'On Hold').length, color: '#F59E0B' },
    { name: 'Completed', value: projects.filter(p => p.status === 'Completed').length, color: '#10B981' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard Principal</h1>
        <p className="text-slate-500 mt-2">Visão geral do seu sistema operacional de vida.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
              <Target size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Projetos Ativos</p>
              <p className="text-2xl font-bold text-slate-900">{activeProjects.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Taxa de Conclusão</p>
              <p className="text-2xl font-bold text-slate-900">{completionRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <ArrowRight size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Áreas de Foco</p>
              <p className="text-2xl font-bold text-slate-900">{areas.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
              <AlertTriangle size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Riscos Mapeados</p>
              <p className="text-2xl font-bold text-slate-900">
                {projects.reduce((acc, p) => acc + (p.risks?.length || 0), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Projects & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Projects List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="font-semibold text-lg text-slate-800">Projetos em Andamento</h2>
            <Link to="/projects" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">Ver todos</Link>
          </div>
          <div className="p-6 space-y-4 flex-1">
            {activeProjects.length === 0 ? (
              <p className="text-slate-400 text-center py-8">Nenhum projeto ativo no momento.</p>
            ) : (
              activeProjects.map(project => (
                <div key={project.id} className="group flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100 hover:border-indigo-200 transition-colors">
                  <div className="mb-3 md:mb-0">
                    <h3 className="font-medium text-slate-900">{project.title}</h3>
                    <p className="text-sm text-slate-500 truncate max-w-md">{project.objective}</p>
                    <div className="mt-2 flex items-center gap-4 text-xs text-slate-400">
                      <span>Prazo: {project.deadline ? new Date(project.deadline).toLocaleDateString('pt-BR') : 'N/A'}</span>
                      <span>{project.tasks?.filter(t => t.completed).length || 0}/{project.tasks?.length || 0} Tarefas</span>
                    </div>
                  </div>
                  <div className="w-full md:w-32">
                    <div className="flex justify-between text-xs mb-1 text-slate-500">
                      <span>Progresso</span>
                      <span>{project.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${project.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Charts & Focus Areas */}
        <div className="space-y-8">
          {/* Status Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-80">
            <h2 className="font-semibold text-lg text-slate-800 mb-4">Status dos Projetos</h2>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 text-xs text-slate-500 mt-[-20px]">
              {projectStatusData.map(item => (
                <div key={item.name} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span>{item.name} ({item.value})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links / Areas */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="font-semibold text-lg text-slate-800 mb-4">Áreas Recentes</h2>
            <div className="flex flex-wrap gap-2">
              {areas.slice(0, 5).map(area => (
                <span key={area.id} className={`px-3 py-1 rounded-full text-xs font-medium text-white ${area.color}`}>
                  {area.title}
                </span>
              ))}
              <Link to="/areas" className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200">
                + Ver todas
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
