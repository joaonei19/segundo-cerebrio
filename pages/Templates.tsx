import React from 'react';
import { TEMPLATES } from '../constants';
import { Copy, FilePlus } from 'lucide-react';

const Templates: React.FC = () => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Template copiado para a área de transferência!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Templates</h1>
        <p className="text-slate-500">Modelos prontos para economizar energia mental.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {TEMPLATES.map(template => (
          <div key={template.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-900">{template.title}</h3>
                <span className="text-xs font-medium text-slate-500 uppercase">{template.category}</span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => copyToClipboard(template.content)}
                  className="p-2 hover:bg-slate-200 rounded text-slate-600 transition-colors"
                  title="Copiar Template"
                >
                  <Copy size={18} />
                </button>
              </div>
            </div>
            <div className="p-6 bg-white max-h-64 overflow-y-auto">
              <pre className="whitespace-pre-wrap font-mono text-xs text-slate-600 bg-slate-50 p-4 rounded border border-slate-100">
                {template.content}
              </pre>
            </div>
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-center">
              <button 
                onClick={() => copyToClipboard(template.content)}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center justify-center gap-2 w-full"
              >
                <FilePlus size={16} /> Usar este template
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Templates;
