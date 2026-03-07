import React, { useState } from 'react';
import { Share2, Check, AlertCircle, Loader2 } from 'lucide-react';
import { KnowledgeItem } from '../types';

interface NotionSyncProps {
  items: KnowledgeItem[];
}

const NotionSync: React.FC<NotionSyncProps> = ({ items }) => {
  const [apiKey, setApiKey] = useState('');
  const [databaseId, setDatabaseId] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleSync = async () => {
    if (!apiKey || !databaseId) {
      setError('Por favor, insira a API Key e o Database ID.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setError('');

    try {
      const response = await fetch('/api/notion/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey, databaseId, items }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        throw new Error(data.error || 'Erro desconhecido ao sincronizar.');
      }
    } catch (err: any) {
      setError(err.message);
      setStatus('error');
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-black text-white rounded-lg">
          <Share2 size={20} />
        </div>
        <div>
          <h2 className="font-bold text-slate-900">Integração com Notion</h2>
          <p className="text-xs text-slate-500">Sincronize suas notas e projetos com o Notion.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Notion API Key (Internal Integration Token)</label>
          <input 
            type="password" 
            placeholder="secret_..." 
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Database ID</label>
          <input 
            type="text" 
            placeholder="O ID do seu banco de dados no Notion" 
            value={databaseId}
            onChange={e => setDatabaseId(e.target.value)}
            className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <button 
          onClick={handleSync}
          disabled={status === 'loading'}
          className={`
            w-full py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all
            ${status === 'loading' ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 
              status === 'success' ? 'bg-green-600 text-white' : 
              status === 'error' ? 'bg-red-600 text-white' : 'bg-black text-white hover:bg-slate-800'}
          `}
        >
          {status === 'loading' ? (
            <><Loader2 size={16} className="animate-spin" /> Sincronizando {items.length} itens...</>
          ) : status === 'success' ? (
            <><Check size={16} /> Sincronizado com Sucesso!</>
          ) : (
            <><Share2 size={16} /> Sincronizar Agora</>
          )}
        </button>

        {status === 'error' && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2 text-red-700 text-xs">
            <AlertCircle size={14} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="pt-4 border-t border-slate-100">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2">Como configurar?</h4>
          <ol className="text-[10px] text-slate-500 space-y-1 list-decimal list-inside">
            <li>Crie uma integração em <a href="https://www.notion.so/my-integrations" target="_blank" className="text-indigo-600 underline">Notion Integrations</a></li>
            <li>Copie o "Internal Integration Token" e cole acima.</li>
            <li>Crie um banco de dados no Notion com as colunas: <b>Name</b> (Title), <b>Type</b> (Select), <b>Status</b> (Select) e <b>Content</b> (Text).</li>
            <li>No Notion, clique em "..." no topo da página do banco de dados e adicione sua integração em "Add Connections".</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default NotionSync;
