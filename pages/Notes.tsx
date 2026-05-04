import React, { useState } from 'react';
import { KnowledgeItem, Area } from '../types';
import MDEditor from '@uiw/react-md-editor';
import { Plus, Trash2, Link as LinkIcon, Cloud, Tag, Inbox, FolderKanban, Target, AlertTriangle, Search, Archive, ArrowDownToLine } from 'lucide-react';

interface KnowledgeBaseProps {
  items: KnowledgeItem[];
  setItems: React.Dispatch<React.SetStateAction<KnowledgeItem[]>>;
  areas: Area[];
}

const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ items, setItems, areas }) => {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Derived state for the active item
  const activeItem = items.find(n => n.id === selectedItemId) || null;

  // Filter items: Not Archived AND matches search
  const filteredItems = items
    .filter(item => !item.isArchived)
    .filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const createItem = () => {
    const newItem: KnowledgeItem = {
      id: Date.now().toString(),
      title: 'Nova Informação',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isSynced: false,
      isProject: false,
      isArchived: false
    };
    setItems(prev => [newItem, ...prev]);
    setSelectedItemId(newItem.id);
  };

  const updateActiveItem = (updates: Partial<KnowledgeItem>) => {
    if (!selectedItemId) return;
    setItems(prev => prev.map(n => 
      n.id === selectedItemId ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n
    ));
  };

  const archiveItem = (id: string) => {
    setItems(prev => prev.map(n => n.id === id ? { ...n, isArchived: true } : n));
    if (selectedItemId === id) setSelectedItemId(null);
  };

  const deleteItem = (id: string) => {
    if (window.confirm('Isso excluirá o item permanentemente. Para salvar histórico, use a função "Arquivar". Continuar?')) {
      setItems(prev => prev.filter(n => n.id !== id));
      if (selectedItemId === id) setSelectedItemId(null);
    }
  };

  const toggleProjectStatus = () => {
    if(!activeItem) return;
    if (!activeItem.isProject) {
        // Turning into a project
        updateActiveItem({ 
            isProject: true, 
            status: 'Active',
            deadline: new Date().toISOString(),
            tasks: [],
            kpis: [],
            risks: []
        });
    } else {
        if(window.confirm("Isso ocultará os dados de projeto (KPIs, tarefas). Deseja continuar?")) {
            updateActiveItem({ isProject: false });
        }
    }
  };

  const simulateDriveSync = () => {
    if (!activeItem) return;
    const btn = document.getElementById('sync-btn');
    if(btn) btn.classList.add('animate-pulse');

    setTimeout(() => {
        updateActiveItem({ isSynced: true });
        if(btn) btn.classList.remove('animate-pulse');
        alert(`Item sincronizado com Google Drive!`);
    }, 1000);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-6">
      
      {/* Sidebar - List */}
      <div className={`flex-1 md:w-80 md:flex-none flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm ${activeItem ? 'hidden md:flex' : 'flex'}`}>
        
        {/* Search & Actions */}
        <div className="p-4 border-b border-slate-100 bg-slate-50 space-y-3">
          <div className="flex justify-between items-center">
            <div>
                <h2 className="font-bold text-slate-800">Base de Conhecimento</h2>
                <p className="text-[10px] text-slate-500">Inbox & Projetos Ativos</p>
            </div>
            <button 
                onClick={createItem}
                className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                title="Criar novo item"
            >
                <Plus size={18} />
            </button>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
                type="text" 
                placeholder="Buscar notas..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <Inbox size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">{searchTerm ? 'Nenhum resultado.' : 'Inbox vazia.'}</p>
            </div>
          ) : (
            filteredItems.map(item => {
                const area = areas.find(a => a.id === item.areaId);
                const isInbox = !item.areaId;
                
                return (
                <div 
                    key={item.id}
                    onClick={() => setSelectedItemId(item.id)}
                    className={`
                    p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors
                    ${selectedItemId === item.id ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : 'border-l-4 border-l-transparent'}
                    `}
                >
                    <div className="flex justify-between items-start mb-1">
                        <h3 className={`font-semibold text-sm truncate pr-2 ${selectedItemId === item.id ? 'text-indigo-900' : 'text-slate-800'}`}>
                        {item.title || 'Sem título'}
                        </h3>
                        {item.isProject && <FolderKanban size={14} className="text-indigo-500 flex-shrink-0" />}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                    <span className={`text-[10px] truncate max-w-[120px] flex items-center gap-1 font-medium ${isInbox ? 'text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded' : 'text-slate-400'}`}>
                        {isInbox ? (
                            <><Inbox size={10} /> INBOX</>
                        ) : (
                            <>
                                <div className={`w-1.5 h-1.5 rounded-full ${area?.color || 'bg-slate-300'}`}></div>
                                {area?.title}
                            </>
                        )}
                    </span>
                    {item.isSynced && <Cloud size={10} className="text-green-500" />}
                    </div>
                </div>
                );
            })
          )}
        </div>
      </div>

      {/* Main Editor */}
      <div className={`flex-[2] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col ${!activeItem ? 'hidden md:flex items-center justify-center bg-slate-50' : ''}`}>
        {!activeItem ? (
          <div className="text-center text-slate-400">
            <Tag size={48} className="mx-auto mb-4 opacity-50" />
            <p>Selecione um item para editar.</p>
          </div>
        ) : (
          <>
            {/* Editor Toolbar */}
            <div className="h-16 border-b border-slate-100 flex items-center justify-between px-6 bg-slate-50">
              <button onClick={() => setSelectedItemId(null)} className="md:hidden text-slate-500 text-sm">← Voltar</button>

              <div className="flex items-center gap-4">
                  {/* Category Selector */}
                  <div className={`flex items-center gap-2 bg-white px-2 py-1 rounded border transition-colors ${!activeItem.areaId ? 'border-amber-300 ring-2 ring-amber-100' : 'border-slate-200'}`}>
                    <div className={`w-3 h-3 rounded-full ${areas.find(a => a.id === activeItem.areaId)?.color || 'bg-slate-300'}`} />
                    <select 
                      value={activeItem.areaId || ''}
                      onChange={(e) => updateActiveItem({ areaId: e.target.value || undefined })}
                      className="bg-transparent text-sm font-medium text-slate-600 focus:outline-none cursor-pointer w-32 md:w-48"
                    >
                      <option value="">📥 Inbox (Sem Área)</option>
                      <optgroup label="Áreas de Vida">
                        {areas.map(area => (
                          <option key={area.id} value={area.id}>{area.title}</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  {/* Project Toggle */}
                  <button
                    onClick={toggleProjectStatus}
                    className={`
                        flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold transition-all
                        ${activeItem.isProject 
                            ? 'bg-indigo-600 text-white shadow-md' 
                            : 'bg-slate-200 text-slate-500 hover:bg-slate-300'}
                    `}
                  >
                    <FolderKanban size={12} />
                    {activeItem.isProject ? 'PROJETO' : 'NOTA'}
                  </button>
              </div>

              <div className="flex items-center gap-1">
                <button 
                  id="sync-btn"
                  onClick={simulateDriveSync}
                  className={`p-2 rounded hover:bg-slate-200 transition-colors ${activeItem.isSynced ? 'text-green-600' : 'text-slate-400'}`}
                  title="Sincronizar com Drive"
                >
                  <Cloud size={18} />
                </button>
                <div className="h-4 w-px bg-slate-300 mx-2"></div>
                <button 
                  onClick={() => archiveItem(activeItem.id)}
                  className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                  title="Arquivar (Mover para Archive)"
                >
                  <Archive size={18} />
                </button>
                <button 
                  onClick={() => deleteItem(activeItem.id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                  title="Excluir Permanentemente"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col p-6 overflow-y-auto">
              <input
                type="text"
                value={activeItem.title}
                onChange={(e) => updateActiveItem({ title: e.target.value })}
                placeholder="Título do Item"
                className="text-3xl font-bold text-slate-900 placeholder:text-slate-300 border-none focus:ring-0 px-0 mb-4 bg-transparent"
              />

              {/* PROJECT SPECIFIC FIELDS */}
              {activeItem.isProject && (
                  <div className="mb-6 bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                      <div className="flex gap-4 mb-4">
                          <div className="flex-1">
                              <label className="text-xs font-bold text-indigo-900 uppercase">Status</label>
                              <select 
                                value={activeItem.status}
                                onChange={(e) => updateActiveItem({ status: e.target.value as any })}
                                className="w-full mt-1 rounded border-indigo-200 text-sm"
                              >
                                  <option value="Active">Em Andamento</option>
                                  <option value="On Hold">Em Espera</option>
                                  <option value="Completed">Concluído</option>
                              </select>
                          </div>
                          <div className="flex-1">
                             <label className="text-xs font-bold text-indigo-900 uppercase">Deadline</label>
                             <input 
                                type="date" 
                                value={activeItem.deadline ? activeItem.deadline.split('T')[0] : ''}
                                onChange={(e) => updateActiveItem({ deadline: new Date(e.target.value).toISOString() })}
                                className="w-full mt-1 rounded border-indigo-200 text-sm"
                             />
                          </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-indigo-900 uppercase mb-1 flex items-center gap-1"><Target size={12}/> KPIs</label>
                            <textarea 
                                className="w-full text-xs rounded border-indigo-200 h-16 resize-none" 
                                placeholder="Metas numéricas..."
                                value={activeItem.kpis?.join('\n') || ''}
                                onChange={(e) => updateActiveItem({ kpis: e.target.value.split('\n') })}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-indigo-900 uppercase mb-1 flex items-center gap-1"><AlertTriangle size={12}/> Riscos</label>
                            <textarea 
                                className="w-full text-xs rounded border-indigo-200 h-16 resize-none" 
                                placeholder="O que pode dar errado..."
                                value={activeItem.risks?.join('\n') || ''}
                                onChange={(e) => updateActiveItem({ risks: e.target.value.split('\n') })}
                            />
                        </div>
                      </div>
                  </div>
              )}

              <div data-color-mode="light" className="flex-1 overflow-hidden flex flex-col pt-2">
                  <MDEditor
                    value={activeItem.content}
                    onChange={(val) => updateActiveItem({ content: val || '' })}
                    height="100%"
                    className="flex-1 w-full !border-0"
                    visibleDragbar={false}
                    previewOptions={{
                      className: 'prose prose-sm max-w-none text-slate-700'
                    }}
                  />
              </div>
            </div>
            
            {/* Footer */}
            <div className="h-8 border-t border-slate-100 flex items-center justify-between px-4 text-[10px] text-slate-400 bg-slate-50">
               <div className="flex gap-2">
                   {activeItem.driveLink && <a href={activeItem.driveLink} className="flex items-center gap-1 hover:text-indigo-600"><LinkIcon size={10}/> Link Externo</a>}
               </div>
               <div className="flex gap-4">
                <span>Criado: {new Date(activeItem.createdAt).toLocaleDateString()}</span>
                <span>{activeItem.isSynced ? 'Salvo no Drive' : 'Alterações pendentes'}</span>
               </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default KnowledgeBase;