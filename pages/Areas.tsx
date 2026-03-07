import React, { useState } from 'react';
import { Area } from '../types';
import * as Icons from 'lucide-react';
import { Plus, X } from 'lucide-react';

interface AreasProps {
  areas: Area[];
  setAreas: React.Dispatch<React.SetStateAction<Area[]>>;
}

const Areas: React.FC<AreasProps> = ({ areas, setAreas }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newArea, setNewArea] = useState({ title: '', description: '', icon: 'Folder', color: 'bg-slate-500' });

  const handleAddArea = () => {
    if (!newArea.title) return;
    const area: Area = {
      id: Date.now().toString(),
      ...newArea
    };
    setAreas(prev => [...prev, area]);
    setIsAdding(false);
    setNewArea({ title: '', description: '', icon: 'Folder', color: 'bg-slate-500' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Áreas de Vida</h1>
          <p className="text-slate-500">Padrões a manter e responsabilidades contínuas.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          <Plus size={18} /> Nova Área
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl border border-indigo-200 shadow-md animate-in fade-in slide-in-from-top-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-slate-800">Adicionar Nova Área</h2>
            <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input 
              type="text" 
              placeholder="Título da Área" 
              value={newArea.title}
              onChange={e => setNewArea(prev => ({ ...prev, title: e.target.value }))}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <select 
              value={newArea.color}
              onChange={e => setNewArea(prev => ({ ...prev, color: e.target.value }))}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="bg-blue-500">Azul</option>
              <option value="bg-green-500">Verde</option>
              <option value="bg-red-500">Vermelho</option>
              <option value="bg-yellow-500">Amarelo</option>
              <option value="bg-purple-500">Roxo</option>
              <option value="bg-pink-500">Rosa</option>
              <option value="bg-slate-500">Cinza</option>
            </select>
            <input 
              type="text" 
              placeholder="Descrição curta" 
              value={newArea.description}
              onChange={e => setNewArea(prev => ({ ...prev, description: e.target.value }))}
              className="md:col-span-2 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <button 
            onClick={handleAddArea}
            className="w-full py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors"
          >
            Salvar Área
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {areas.map(area => {
          // Dynamic Icon Rendering
          const IconComponent = (Icons as any)[area.icon] || Icons.Folder;

          return (
            <div key={area.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group">
              <div className={`h-2 ${area.color}`}></div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-slate-50 text-slate-700 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors`}>
                    <IconComponent size={24} />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{area.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">{area.description}</p>
                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Responsabilidade</span>
                  <button className="text-sm text-indigo-600 font-medium hover:underline">Ver Detalhes</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Areas;
