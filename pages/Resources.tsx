import React, { useState } from 'react';
import { Resource, KnowledgeItem } from '../types';
import { Search, Hash, FileText, ExternalLink } from 'lucide-react';
import NotionSync from '../components/NotionSync';

interface ResourcesProps {
  resources: Resource[];
  items: KnowledgeItem[];
}

const Resources: React.FC<ResourcesProps> = ({ resources, items }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | 'All'>('All');

  const categories = ['All', ...Array.from(new Set(resources.map(r => r.category)))];

  const filteredResources = resources.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || r.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Recursos & Biblioteca</h1>
              <p className="text-slate-500">Coisas interessantes para referência futura.</p>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Buscar por título ou tag..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                  ${selectedCategory === cat 
                    ? 'bg-slate-800 text-white' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}
                `}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredResources.map(resource => (
              <div key={resource.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:border-indigo-300 transition-colors flex flex-col h-full">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                    {resource.category}
                  </span>
                  <FileText size={18} className="text-slate-400" />
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 mb-2">{resource.title}</h3>
                <p className="text-sm text-slate-500 line-clamp-3 mb-4 flex-1">
                  {resource.content}
                </p>

                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {resource.tags.map(tag => (
                      <div key={tag} className="flex items-center text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                        <Hash size={10} className="mr-1" /> {tag}
                      </div>
                    ))}
                  </div>
                  {resource.url && (
                    <a href="#" className="flex items-center text-xs text-indigo-600 hover:underline">
                      <ExternalLink size={12} className="mr-1" /> Acessar Link Original
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notion Sidebar */}
        <div className="lg:col-span-1">
          <NotionSync items={items} />
        </div>
      </div>
    </div>
  );
};

export default Resources;
