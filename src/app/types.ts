export interface Objective {
  id: string;
  kanbanId?: string; // Added for backend compatibility
  title: string;
  description?: string;
  color: string;
  createdAt: Date | string; // Support both Date and ISO string
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Resources {
  material: string[];
  human: string[];
  financial: string[];
}

export interface Task {
  id: string;
  objectiveId: string;
  kanbanId?: string; // Added for backend compatibility
  title: string;
  description: string;
  checklist: ChecklistItem[];
  resources: Resources;
  estimatedHours: number;
  elapsedHours?: number;
  status: 'tasks' | 'urgent' | 'inProgress' | 'verification' | 'complete';
  assignedTo?: string;
  createdAt: Date | string; // Support both Date and ISO string
  startedAt?: Date | string; // Support both Date and ISO string
  completedAt?: Date | string; // Support both Date and ISO string
}

export interface TeamMember {
  id: string;
  name: string;
  email?: string; // Added for backend compatibility
  role: string;
  avatar?: string;
  isAdmin: boolean;
  joinedAt?: Date | string; // Added for backend compatibility
}

// Added for backend compatibility
export interface User {
  id: string;
  email: string;
  name: string;
  user_metadata?: {
    name?: string;
  };
}

export interface Kanban {
  id: string;
  title: string;
  inviteCode: string;
  ownerId: string;
  ownerName: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface DashboardStats {
  totalObjectives: number;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  urgentTasks: number;
  verificationTasks: number;
  totalHours: number;
  completedHours: number;
  teamMembers: number;
}