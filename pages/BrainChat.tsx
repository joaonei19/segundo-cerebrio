import React, { useState, useRef, useEffect } from 'react';
import { KnowledgeItem, Area, Resource } from '../types';
import { askSecondBrain } from '../services/gemini';
import { Send, Bot, Loader2, Database, ShieldCheck, FileText } from 'lucide-react';

interface BrainChatProps {
  items: KnowledgeItem[];
  areas: Area[];
  resources: Resource[];
}

const BrainChat: React.FC<BrainChatProps> = ({ items, areas, resources }) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([
    { role: 'ai', content: 'Olá! Estou conectado à sua Base de Conhecimento Segura. Só responderei perguntas baseadas nas suas notas e projetos atuais. O que deseja saber?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!query.trim()) return;

    const userMsg = query;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setQuery('');
    setIsLoading(true);

    // Pass items instead of projects (since items contains projects now)
    const answer = await askSecondBrain(userMsg, { items, areas, resources });

    setMessages(prev => [...prev, { role: 'ai', content: answer }]);
    setIsLoading(false);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
        
        {/* Context Sidebar (Visual only to show groundedness) */}
        <div className="hidden lg:flex w-64 flex-col bg-white border border-slate-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4 text-emerald-600 font-bold text-sm">
                <ShieldCheck size={16} />
                <span>Contexto Seguro (RAG)</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
                A IA está restrita a ler apenas os seguintes {items.length} documentos da sua base:
            </p>
            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                {items.map(item => (
                    <div key={item.id} className="flex items-center gap-2 p-2 bg-slate-50 rounded border border-slate-100 text-xs text-slate-600">
                        <FileText size={12} className={item.isProject ? "text-indigo-500" : "text-slate-400"} />
                        <span className="truncate">{item.title}</span>
                    </div>
                ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 text-[10px] text-slate-400 text-center">
                <Database size={12} className="inline mr-1" />
                Dados encriptados via Drive
            </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden relative">
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
                {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-indigo-600' : 'bg-emerald-600'}`}>
                            {msg.role === 'user' ? <span className="text-white text-xs">Eu</span> : <Bot size={16} className="text-white" />}
                        </div>
                        <div 
                        className={`p-4 rounded-xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                            msg.role === 'user' 
                            ? 'bg-white text-slate-800 border border-slate-200 rounded-tr-none' 
                            : 'bg-white text-slate-800 border border-emerald-100 rounded-tl-none ring-1 ring-emerald-50'
                        }`}
                        >
                        {msg.content}
                        </div>
                    </div>
                </div>
                ))}
                {isLoading && (
                <div className="flex justify-start">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                        <Loader2 className="animate-spin text-indigo-600" size={18} />
                        <span className="text-sm text-slate-500">Consultando base de dados...</span>
                    </div>
                </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-200">
                <div className="flex gap-2 max-w-4xl mx-auto">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Pergunte algo sobre seus projetos ou notas..."
                        className="flex-1 px-4 py-3 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    />
                    <button 
                        onClick={handleSend}
                        disabled={isLoading || !query.trim()}
                        className="px-6 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default BrainChat;
