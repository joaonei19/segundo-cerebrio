export type ParaCategory = 'Projects' | 'Areas' | 'Resources' | 'Archive';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
}

export interface Area {
  id: string;
  title: string;
  icon: string;
  description: string;
  color: string;
}

export interface Resource {
  id: string;
  title: string;
  category: string;
  content: string; 
  tags: string[];
  url?: string;
}

export interface NoteTemplate {
  id: string;
  title: string;
  content: string;
  category: 'Meeting' | 'Study' | 'Project' | 'Finance' | 'Routine' | 'Goal';
}

export interface ReviewChecklist {
  id: string;
  title: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly';
  items: string[];
}

// The unified Data Structure
export interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  areaId?: string; // If undefined, it's in the "Inbox"
  createdAt: string;
  updatedAt: string;
  driveLink?: string;
  isSynced?: boolean;
  
  // Archiving
  isArchived?: boolean;

  // Project Specifics (Optional)
  isProject: boolean;
  status?: 'Active' | 'On Hold' | 'Completed';
  objective?: string;
  deadline?: string;
  tasks?: Task[];
  kpis?: string[];
  risks?: string[];
  progress?: number;
}