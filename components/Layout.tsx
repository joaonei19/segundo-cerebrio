import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Grid, Database, CheckSquare, Settings, Menu, X, Sparkles, Book, MessageCircle, Archive, Calendar } from 'lucide-react';

const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/kb', label: 'Base de Conhecimento', icon: Book },
    { path: '/projects', label: 'Projetos (Projects)', icon: FolderKanban },
    { path: '/areas', label: 'Áreas (Areas)', icon: Grid },
    { path: '/resources', label: 'Recursos (Resources)', icon: Database },
    { path: '/agenda', label: 'Agenda (Secretaria)', icon: Calendar },
    { path: '/archive', label: 'Arquivo (Archive)', icon: Archive },
    { type: 'divider' }, // Visual separator logic handling below
    { path: '/chat', label: 'Brain Chat (AI)', icon: MessageCircle },
    { path: '/reviews', label: 'Rituais & Revisão', icon: CheckSquare },
    { path: '/templates', label: 'Templates', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out
        lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <span>2º Cérebro</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item, idx) => {
            if (item.type === 'divider') {
                return <div key={idx} className="h-px bg-slate-800 my-3 mx-2" />
            }
            // TypeScript guard
            if (!item.path) return null;

            return (
                <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) => `
                    flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                    ${isActive 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }
                `}
                >
                <item.icon size={18} />
                {item.label}
                </NavLink>
            )
          })}
        </nav>
        
        {/* User profile removed as requested for single-user personal system */}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 bg-white border-b border-slate-200 flex items-center px-4 justify-between shrink-0">
          <button onClick={() => setIsSidebarOpen(true)} className="text-slate-600">
            <Menu size={24} />
          </button>
          <span className="font-semibold text-slate-800">Segundo Cérebro</span>
          <div className="w-6" /> {/* Spacer */}
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;