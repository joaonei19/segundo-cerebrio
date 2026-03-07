import React from 'react';
import { KnowledgeItem } from '../types';
import { Archive as ArchiveIcon, RefreshCcw, Trash2, Search } from 'lucide-react';

interface ArchiveProps {
  items: KnowledgeItem[];
  setItems: React.Dispatch<React.SetStateAction<KnowledgeItem[]>>;
}

const Archive: React.FC<ArchiveProps> = ({ items, setItems }) => {
  const archivedItems = items.filter(i => i.isArchived);

  const restoreItem = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, isArchived: false } : i));
  };

  const deleteForever = (id: string) => {
    if(window.confirm("Essa ação não pode ser desfeita. Tem certeza?")) {
        setItems(prev => prev.filter(i => i.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ArchiveIcon className="text-slate-400" />
            Arquivo Morto
        </h1>
        <p className="text-slate-500">Itens concluídos ou desativados. Eles ainda aparecem na busca para referência.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {archivedItems.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
                <ArchiveIcon size={48} className="mx-auto mb-4 opacity-20" />
                <p>O arquivo está vazio.</p>
            </div>
        ) : (
            <div className="divide-y divide-slate-100">
                {archivedItems.map(item => (
                    <div key={item.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50">
                        <div>
                            <h3 className="font-semibold text-slate-700 decoration-slate-400">{item.title}</h3>
                            <p className="text-xs text-slate-400 mt-1 line-clamp-1">{item.content || 'Sem conteúdo'}</p>
                            <div className="flex gap-2 mt-2">
                                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-300 border border-slate-200 px-1 rounded">
                                    {item.isProject ? 'Projeto' : 'Nota'}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => restoreItem(item.id)}
                                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                            >
                                <RefreshCcw size={12} /> Restaurar
                            </button>
                            <button 
                                onClick={() => deleteForever(item.id)}
                                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                            >
                                <Trash2 size={12} /> Excluir
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default Archive;