import React, { useState } from 'react';
import { KnowledgeItem, Task } from '../types';
import { Plus, Calendar, CheckSquare, Target, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProjectsProps {
  projects: KnowledgeItem[];
  setProjects: React.Dispatch<React.SetStateAction<KnowledgeItem[]>>;
}

const Projects: React.FC<ProjectsProps> = ({ projects, setProjects }) => {
  const [selectedProject, setSelectedProject] = useState<KnowledgeItem | null>(null);

  // Helper to update state inside the array
  const updateProject = (projectId: string, updates: Partial<KnowledgeItem>) => {
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, ...updates } : p));
      if (selectedProject?.id === projectId) {
          setSelectedProject(prev => prev ? { ...prev, ...updates } : null);
      }
  };

  const toggleTask = (projectId: string, taskId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project || !project.tasks) return;

    const updatedTasks = project.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
    const completed = updatedTasks.filter(t => t.completed).length;
    const progress = updatedTasks.length > 0 ? Math.round((completed / updatedTasks.length) * 100) : 0;

    updateProject(projectId, { tasks: updatedTasks, progress });
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6">
      {/* Project List */}
      <div className={`flex-1 ${selectedProject ? 'hidden lg:block lg:w-1/3 lg:flex-none' : 'w-full'}`}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Projetos Ativos</h1>
            <p className="text-sm text-slate-500">Filtrado da Base de Conhecimento</p>
          </div>
          <Link to="/kb" className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
            <Plus size={16} /> Novo via KB
          </Link>
        </div>

        <div className="space-y-4">
          {projects.filter(p => p.isProject).length === 0 ? (
             <div className="text-center py-10 text-slate-400">Nenhum projeto definido. Vá em "Base de Conhecimento" e transforme uma nota em projeto.</div>
          ) : projects.filter(p => p.isProject).map(project => (
            <div 
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className={`
                p-4 rounded-xl border cursor-pointer transition-all
                ${selectedProject?.id === project.id 
                  ? 'bg-indigo-50 border-indigo-500 shadow-md ring-1 ring-indigo-500' 
                  : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-sm'
                }
              `}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-slate-800">{project.title}</h3>
                <span className={`px-2 py-0.5 rounded text-xs font-medium
                  ${project.status === 'Active' ? 'bg-green-100 text-green-700' : 
                    project.status === 'On Hold' ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-700'}
                `}>
                  {project.status}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                <Calendar size={12} />
                <span>Deadline: {project.deadline ? new Date(project.deadline).toLocaleDateString('pt-BR') : 'N/A'}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div 
                  className="bg-indigo-500 h-1.5 rounded-full" 
                  style={{ width: `${project.progress || 0}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Details */}
      <div className={`flex-[2] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col ${!selectedProject ? 'hidden lg:flex items-center justify-center bg-slate-50 border-dashed' : ''}`}>
        {!selectedProject ? (
          <div className="text-center text-slate-400">
            <Target size={48} className="mx-auto mb-4 opacity-50" />
            <p>Selecione um projeto para ver os detalhes</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
              <div>
                <button onClick={() => setSelectedProject(null)} className="lg:hidden text-sm text-indigo-600 mb-2">← Voltar</button>
                <h2 className="text-2xl font-bold text-slate-900">{selectedProject.title}</h2>
                <p className="text-slate-600 mt-1">{selectedProject.objective || 'Sem objetivo definido.'}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-indigo-600">{selectedProject.progress || 0}%</div>
                <div className="text-xs text-slate-500">Concluído</div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* KPIs & Risks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                    <Target size={18} /> KPIs (Sucesso)
                  </h4>
                  <ul className="list-disc list-inside text-sm text-blue-900 space-y-1">
                    {selectedProject.kpis?.map((kpi, idx) => (
                      <li key={idx}>{kpi}</li>
                    )) || <li className="text-blue-400 italic">Nenhum KPI definido</li>}
                  </ul>
                </div>

                <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                  <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                    <AlertTriangle size={18} /> Riscos & Mitigação
                  </h4>
                  <ul className="list-disc list-inside text-sm text-red-900 space-y-1">
                    {selectedProject.risks?.map((risk, idx) => (
                      <li key={idx}>{risk}</li>
                    )) || <li className="text-red-400 italic">Sem riscos mapeados</li>}
                  </ul>
                </div>
              </div>

              {/* Next Actions */}
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <CheckSquare size={20} className="text-slate-400" /> Próximas Ações
                </h3>
                <div className="space-y-2">
                  {selectedProject.tasks?.map(task => (
                    <label key={task.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors cursor-pointer group">
                      <div className={`
                        w-5 h-5 rounded border flex items-center justify-center transition-colors
                        ${task.completed ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300 group-hover:border-indigo-400'}
                      `}>
                        <input 
                          type="checkbox" 
                          checked={task.completed} 
                          onChange={() => toggleTask(selectedProject.id, task.id)}
                          className="hidden" 
                        />
                        {task.completed && <CheckSquare size={12} className="text-white" />}
                      </div>
                      <span className={`text-sm ${task.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                        {task.title}
                      </span>
                    </label>
                  )) || <div className="text-sm text-slate-400 italic">Nenhuma tarefa cadastrada.</div>}
                  
                  {/* Quick Task Input */}
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <input 
                      type="text"
                      placeholder="+ Adicionar nova tarefa e pressione Enter"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                          const newTaskId = Date.now().toString();
                          const newTask: Task = { id: newTaskId, title: e.currentTarget.value.trim(), completed: false };
                          const updatedTasks = [...(selectedProject.tasks || []), newTask];
                          const completed = updatedTasks.filter(t => t.completed).length;
                          const progress = updatedTasks.length > 0 ? Math.round((completed / updatedTasks.length) * 100) : 0;
                          
                          updateProject(selectedProject.id, { tasks: updatedTasks, progress });
                          e.currentTarget.value = '';
                        }
                      }}
                      className="w-full px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <Link to="/kb" className="inline-block mt-2 text-sm text-indigo-600 hover:underline">
                    Gerenciar detalhes na Base de Conhecimento →
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Projects;
