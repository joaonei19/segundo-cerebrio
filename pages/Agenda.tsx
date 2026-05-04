import React, { useState } from 'react';
import { Calendar, Clock, Plus, Trash2, CalendarDays, ExternalLink } from 'lucide-react';
import { AgendaEvent, KnowledgeItem } from '../types';

interface AgendaProps {
  items: KnowledgeItem[];
  events: AgendaEvent[];
  setEvents: React.Dispatch<React.SetStateAction<AgendaEvent[]>>;
}

const Agenda: React.FC<AgendaProps> = ({ items, events, setEvents }) => {
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<AgendaEvent>>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    type: 'Meeting',
    description: ''
  });

  // Extract upcoming deadlines from Projects
  const projectDeadlines = items
    .filter(i => i.isProject && !i.isArchived && i.deadline && i.status !== 'Completed')
    .map(project => ({
      id: `proj-${project.id}`,
      title: project.title,
      date: project.deadline!,
      time: undefined,
      type: 'Deadline' as const,
      description: `🎯 Projeto: ${project.objective || 'Sem objetivo definido'}`,
      isProjectRef: true,
      originalId: project.id
    } as AgendaEvent & { isProjectRef?: boolean; originalId?: string }));

  // Combine and sort all events
  const allEvents = [...events, ...projectDeadlines].sort((a, b) => {
    const timeA = (a as AgendaEvent).time;
    const timeB = (b as AgendaEvent).time;
    const dateA = new Date(a.date + (timeA ? `T${timeA}` : 'T00:00:00'));
    const dateB = new Date(b.date + (timeB ? `T${timeB}` : 'T00:00:00'));
    return dateA.getTime() - dateB.getTime();
  });

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date || !newEvent.type) return;

    const eventToSave: AgendaEvent = {
        id: `evt-${Date.now()}`,
        title: newEvent.title,
        date: newEvent.date,
        time: newEvent.time,
        type: newEvent.type as any,
        description: newEvent.description
    };

    setEvents(prev => [...prev, eventToSave]);
    setIsAddingEvent(false);
    setNewEvent({
        title: '',
        date: new Date().toISOString().split('T')[0],
        time: '',
        type: 'Meeting',
        description: ''
    });
  };

  const handleDeleteEvent = (id: string, isProjectRef?: boolean) => {
      // We only delete standalone events from this state.
      if (isProjectRef) {
          alert("Para remover esse prazo, você precisa alterar a data do Projeto em si.");
          return;
      }
      setEvents(events.filter(e => e.id !== id));
  };

  const getTypeColor = (type: string) => {
      switch(type) {
          case 'Meeting': return 'bg-blue-100 text-blue-700 border-blue-200';
          case 'Reminder': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
          case 'Deadline': return 'bg-red-100 text-red-700 border-red-200';
          default: return 'bg-slate-100 text-slate-700 border-slate-200';
      }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="text-indigo-600" size={32} />
            Secretaria & Agenda
          </h1>
          <p className="text-slate-500 mt-1">
            Gerencie suas próximas reuniões, lembretes e prazos de projetos.
          </p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => alert('Integração com Google Calendar será implementada em breve!')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm font-medium"
          >
            <CalendarDays size={18} className="text-blue-500" />
            Conectar Google Calendar
          </button>
          <button 
            onClick={() => setIsAddingEvent(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 border border-transparent text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium"
          >
            <Plus size={18} />
            Novo Evento
          </button>
        </div>
      </div>

      {isAddingEvent && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-in fade-in slide-in-from-top-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Agendar Novo Evento</h2>
            <button onClick={() => setIsAddingEvent(false)} className="text-slate-400 hover:text-slate-600">
              Cancelar
            </button>
          </div>
          <form onSubmit={handleCreateEvent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium text-slate-700">Título</label>
              <input
                required
                type="text"
                value={newEvent.title}
                onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ex: Reunião de Alinhamento"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Data</label>
              <input
                required
                type="date"
                value={newEvent.date}
                onChange={e => setNewEvent({...newEvent, date: e.target.value})}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Horário (Opcional)</label>
                <input
                  type="time"
                  value={newEvent.time}
                  onChange={e => setNewEvent({...newEvent, time: e.target.value})}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Tipo</label>
                <select
                  value={newEvent.type}
                  onChange={e => setNewEvent({...newEvent, type: e.target.value as any})}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="Meeting">Reunião</option>
                  <option value="Reminder">Lembrete</option>
                  <option value="Deadline">Prazo Geral</option>
                  <option value="Other">Outro</option>
                </select>
              </div>
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium text-slate-700">Descrição (Opcional)</label>
              <textarea
                value={newEvent.description}
                onChange={e => setNewEvent({...newEvent, description: e.target.value})}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-20 resize-none"
                placeholder="Detalhes adicionais, links do meet, etc..."
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
              >
                Salvar Evento
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {allEvents.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Calendar className="mx-auto h-12 w-12 text-slate-300 mb-3" />
            <p className="text-lg font-medium text-slate-700">Nenhum evento agendado</p>
            <p>Seus próximos prazos de projetos e reuniões aparecerão aqui.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {allEvents.map((event) => {
                const eventDate = new Date(event.date + 'T00:00:00');
                const today = new Date();
                today.setHours(0,0,0,0);
                const isPast = eventDate < today;

                return (
                  <div key={event.id} className={`p-4 flex flex-col sm:flex-row gap-4 sm:items-center hover:bg-slate-50 transition-colors ${isPast ? 'opacity-60' : ''}`}>
                    <div className="flex-shrink-0 w-24 text-center">
                        <div className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
                            {eventDate.toLocaleDateString('pt-BR', { month: 'short' })}
                        </div>
                        <div className="text-2xl font-bold text-slate-800">
                            {eventDate.getDate().toString().padStart(2, '0')}
                        </div>
                    </div>
                    
                    <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getTypeColor(event.type)}`}>
                                {event.type === 'Meeting' ? 'Reunião' : event.type === 'Deadline' ? 'Prazo' : event.type === 'Reminder' ? 'Lembrete' : 'Outro'}
                            </span>
                            {(event as AgendaEvent).time && (
                                <span className="flex items-center text-xs text-slate-500 font-medium">
                                    <Clock size={12} className="mr-1" />
                                    {(event as AgendaEvent).time}
                                </span>
                            )}
                        </div>
                        <h3 className="text-base font-semibold text-slate-900 truncate flex items-center gap-2">
                             {event.title}
                             {(event as any).isProjectRef && (
                                 <span className="text-xs font-normal text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                                     <ExternalLink size={10} /> Projeto
                                 </span>
                             )}
                        </h3>
                        {event.description && (
                            <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                                {event.description}
                            </p>
                        )}
                    </div>

                    <div className="flex-shrink-0 flex sm:flex-col justify-end gap-2 mt-2 sm:mt-0">
                        <button 
                            onClick={() => handleDeleteEvent(event.id, (event as any).isProjectRef)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remover"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                  </div>
                );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Agenda;
