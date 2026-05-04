import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Areas from './pages/Areas';
import Resources from './pages/Resources';
import Templates from './pages/Templates';
import Reviews from './pages/Reviews';
import KnowledgeBase from './pages/Notes'; 
import BrainChat from './pages/BrainChat';
import Archive from './pages/Archive';
import AssistantPanel from './components/AssistantPanel';
import Agenda from './pages/Agenda';
import OpenDashboardHtml from './components/OpenDashboardHtml';

// Initial Data Import
import { INITIAL_AREAS, INITIAL_ITEMS, INITIAL_RESOURCES, INITIAL_EVENTS } from './constants';
import { Area, Resource, KnowledgeItem, AgendaEvent } from './types';

const App: React.FC = () => {
  // --- PERSISTENCE LOGIC START ---
  
  // 1. Load Items (Notes/Projects) from LocalStorage or fallback to Initial Data
  const [items, setItems] = useState<KnowledgeItem[]>(() => {
    try {
      const savedItems = localStorage.getItem('sb-items');
      return savedItems ? JSON.parse(savedItems) : INITIAL_ITEMS;
    } catch (error) {
      console.error("Error loading items from localStorage", error);
      return INITIAL_ITEMS;
    }
  });
  
  // 2. Load Areas (allows future customization)
  const [areas, setAreas] = useState<Area[]>(() => {
    try {
        const savedAreas = localStorage.getItem('sb-areas');
        return savedAreas ? JSON.parse(savedAreas) : INITIAL_AREAS;
    } catch (e) { return INITIAL_AREAS; }
  });

  // 3. Load Resources
  const [resources, setResources] = useState<Resource[]>(() => {
    try {
        const savedRes = localStorage.getItem('sb-resources');
        return savedRes ? JSON.parse(savedRes) : INITIAL_RESOURCES;
    } catch (e) { return INITIAL_RESOURCES; }
  });

  // 4. Load Events
  const [events, setEvents] = useState<AgendaEvent[]>(() => {
    try {
        const savedEvents = localStorage.getItem('sb-events');
        return savedEvents ? JSON.parse(savedEvents) : INITIAL_EVENTS;
    } catch (e) { return INITIAL_EVENTS; }
  });

  // --- SAVE EFFECTS ---
  
  // Whenever 'items' changes, save to LocalStorage
  useEffect(() => {
    localStorage.setItem('sb-items', JSON.stringify(items));
  }, [items]);

  // Whenever 'areas' changes, save to LocalStorage
  useEffect(() => {
    localStorage.setItem('sb-areas', JSON.stringify(areas));
  }, [areas]);

  // Whenever 'resources' changes, save to LocalStorage
  useEffect(() => {
    localStorage.setItem('sb-resources', JSON.stringify(resources));
  }, [resources]);

  // Whenever 'events' changes, save to LocalStorage
  useEffect(() => {
    localStorage.setItem('sb-events', JSON.stringify(events));
  }, [events]);

  // --- PERSISTENCE LOGIC END ---

  // Derived state for projects (any item that has isProject flag)
  const projects = items.filter(i => i.isProject && !i.isArchived);

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard-html" element={<OpenDashboardHtml />} />
          
          <Route path="projects" element={<Projects projects={items} setProjects={setItems} />} />
          
          <Route path="kb" element={<KnowledgeBase items={items} setItems={setItems} areas={areas} />} />
          
          <Route path="chat" element={<BrainChat items={items} areas={areas} resources={resources} />} />

          <Route path="areas" element={<Areas areas={areas} setAreas={setAreas} />} />
          <Route path="resources" element={<Resources resources={resources} items={items} />} />
          <Route path="agenda" element={<Agenda items={items} events={events} setEvents={setEvents} />} />
          <Route path="archive" element={<Archive items={items} setItems={setItems} />} />
          <Route path="templates" element={<Templates />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      
      {/* Floating AI Assistant (Quick Help) */}
      <AssistantPanel items={items} areas={areas} resources={resources} />
    </HashRouter>
  );
};

export default App;