// src/utils/api.ts
// ⚠️ VERSION MOCK (Test Local) - Simule la base de données dans le navigateur

import { Objective, Task, Kanban } from '../app/types';

// --- UTILITAIRES DE SIMULATION ---
// Simule le temps de réponse d'un serveur (400ms)
const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));
// Génère des IDs uniques
const genId = () => Math.random().toString(36).substring(2, 11);

// Gestion de la fausse base de données locale
const getDb = () => {
  const stored = localStorage.getItem('mock_kanban_db');
  if (stored) return JSON.parse(stored);
  return { users: [], kanbans: [], members: [], objectives: [], tasks: [] };
};
const saveDb = (db: any) => localStorage.setItem('mock_kanban_db', JSON.stringify(db));

// ==================== AUTH API ====================
export const authApi = {
  signup: async (email: string, password: string, name: string) => {
    await delay();
    const db = getDb();
    
    if (db.users.some((u: any) => u.email === email)) {
      throw new Error("Cet email est déjà utilisé.");
    }
    
    const user = { id: genId(), email, password, name };
    db.users.push(user);
    saveDb(db);
    
    const authUser = { id: user.id, email: user.email, user_metadata: { name: user.name } };
    localStorage.setItem('current_user', JSON.stringify(authUser));
    return { user: authUser, access_token: 'fake-jwt-token' };
  },

  signin: async (email: string, password: string) => {
    await delay();
    const db = getDb();
    const user = db.users.find((u: any) => u.email === email && u.password === password);
    
    if (!user) throw new Error("Email ou mot de passe incorrect.");
    
    const authUser = { id: user.id, email: user.email, user_metadata: { name: user.name } };
    localStorage.setItem('current_user', JSON.stringify(authUser));
    return { user: authUser, access_token: 'fake-jwt-token' };
  },

  signout: async () => {
    await delay();
    localStorage.removeItem('current_user');
  },

  getCurrentUser: async () => {
    const userStr = localStorage.getItem('current_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  hasValidSession: () => !!localStorage.getItem('current_user'),
  
  getCachedUser: () => {
    const userStr = localStorage.getItem('current_user');
    return userStr ? JSON.parse(userStr) : null;
  },
};

// ==================== KANBAN API ====================
export const kanbanApi = {
  create: async (title: string) => {
    await delay();
    const db = getDb();
    const currentUser = authApi.getCachedUser();
    if (!currentUser) throw new Error("Non authentifié");

    const kanban = {
      id: genId(),
      title,
      inviteCode: 'KAN-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      ownerId: currentUser.id,
      ownerName: currentUser.user_metadata.name,
      createdAt: new Date().toISOString()
    };
    db.kanbans.push(kanban);

    // Ajouter le créateur comme membre admin
    db.members.push({
      userId: currentUser.id,
      kanbanId: kanban.id,
      role: 'Chef de Projet',
      isAdmin: true
    });
    
    saveDb(db);
    return { kanban };
  },

  getAll: async () => {
    await delay();
    const db = getDb();
    const currentUser = authApi.getCachedUser();
    if (!currentUser) return { kanbans: [] };

    const myKanbanIds = db.members
      .filter((m: any) => m.userId === currentUser.id)
      .map((m: any) => m.kanbanId);
      
    const myKanbans = db.kanbans.filter((k: any) => myKanbanIds.includes(k.id));
    return { kanbans: myKanbans };
  },

  getById: async (id: string) => {
    await delay();
    const db = getDb();
    const currentUser = authApi.getCachedUser();
    
    const kanban = db.kanbans.find((k: any) => k.id === id);
    if (!kanban) throw new Error("Kanban introuvable");

    const objectives = db.objectives.filter((o: any) => o.kanbanId === id);
    const tasks = db.tasks.filter((t: any) => t.kanbanId === id);
    
    // Construire la liste des membres
    const kanbanMembersLinks = db.members.filter((m: any) => m.kanbanId === id);
    const teamMembers = kanbanMembersLinks.map((link: any) => {
      const user = db.users.find((u: any) => u.id === link.userId);
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: link.role,
        isAdmin: link.isAdmin
      };
    });

    const userRole = kanbanMembersLinks.find((m: any) => m.userId === currentUser?.id);

    return { kanban, objectives, tasks, teamMembers, userRole };
  },

  join: async (inviteCode: string, role: string) => {
    await delay();
    const db = getDb();
    const currentUser = authApi.getCachedUser();
    
    const kanban = db.kanbans.find((k: any) => k.inviteCode === inviteCode);
    if (!kanban) throw new Error("Code d'invitation invalide");

    const alreadyMember = db.members.find((m: any) => m.userId === currentUser.id && m.kanbanId === kanban.id);
    
    if (!alreadyMember) {
      db.members.push({
        userId: currentUser.id,
        kanbanId: kanban.id,
        role: role,
        isAdmin: false
      });
      saveDb(db);
    }

    return { kanban };
  }
};

// ==================== OBJECTIVE API ====================
export const objectiveApi = {
  create: async (objective: any) => {
    await delay();
    const db = getDb();
    const newObj = { ...objective, id: genId(), createdAt: new Date().toISOString() };
    db.objectives.push(newObj);
    saveDb(db);
    return { objective: newObj };
  }
};

// ==================== TASK API ====================
export const taskApi = {
  create: async (task: any) => {
    await delay();
    const db = getDb();
    const newTask = { ...task, id: genId(), createdAt: new Date().toISOString() };
    db.tasks.push(newTask);
    saveDb(db);
    return { task: newTask };
  },
  
  update: async (taskId: string, updates: any) => {
    await delay();
    const db = getDb();
    const index = db.tasks.findIndex((t: any) => t.id === taskId);
    if (index > -1) {
      db.tasks[index] = { ...db.tasks[index], ...updates };
      saveDb(db);
    }
    return { success: true };
  },
  
  delete: async (taskId: string) => {
    await delay();
    const db = getDb();
    db.tasks = db.tasks.filter((t: any) => t.id !== taskId);
    saveDb(db);
    return { success: true };
  }
};