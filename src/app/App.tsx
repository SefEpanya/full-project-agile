import React, { useState, useEffect, useCallback } from 'react';
import { AuthPage } from './components/AuthPage';
import { JoinKanbanDialog } from './components/JoinKanbanDialog';
import { InviteCodeDisplay } from './components/InviteCodeDisplay';
import { KanbanBoard } from './components/KanbanBoard';
import { Dashboard } from './components/Dashboard';
import { LoadingScreen } from './components/LoadingScreen';
import { Objective, Task, TeamMember, Kanban } from './types';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { authApi, kanbanApi, objectiveApi, taskApi } from '../utils/api';
import { useRealtimeSync } from '../hooks/useRealtimeSync';

interface KanbanData {
  id: string;
  title: string;
  inviteCode: string;
  owner: TeamMember;
  objectives: Objective[];
  tasks: Task[];
  teamMembers: TeamMember[];
}

function App() {
  const [view, setView] = useState<'auth' | 'kanban' | 'dashboard'>('auth');
  const [currentUser, setCurrentUser] = useState<TeamMember | null>(null);
  const [kanbanData, setKanbanData] = useState<KanbanData | null>(null);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [pendingInviteCode, setPendingInviteCode] = useState<string>('');
  const [showInviteCodeDisplay, setShowInviteCodeDisplay] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (authApi.hasValidSession()) {
          const user = await authApi.getCurrentUser();
          
          // Try to load user's kanbans
          const { kanbans } = await kanbanApi.getAll();
          
          if (kanbans && kanbans.length > 0) {
            // Load the first kanban
            await loadKanban(kanbans[0].id);
          } else {
            // User is authenticated but has no kanbans
            setCurrentUser({
              id: user.id,
              name: user.user_metadata?.name || user.email,
              email: user.email,
              role: 'Utilisateur',
              isAdmin: false,
            });
            setView('auth'); // Show auth page so they can create a kanban
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        authApi.signout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Check for invite code in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const inviteCode = params.get('invite');
    if (inviteCode) {
      setPendingInviteCode(inviteCode);
      setShowJoinDialog(true);
    }
  }, []);

  // Load kanban data from backend
  const loadKanban = async (kanbanId: string) => {
    try {
      setLoading(true);
      const data = await kanbanApi.getById(kanbanId);
      
      const user = authApi.getCachedUser();
      
      setKanbanData({
        id: data.kanban.id,
        title: data.kanban.title,
        inviteCode: data.kanban.inviteCode,
        owner: {
          id: data.kanban.ownerId,
          name: data.kanban.ownerName,
          role: 'Chef de Projet / Propriétaire',
          isAdmin: true,
        },
        objectives: data.objectives || [],
        tasks: data.tasks || [],
        teamMembers: data.teamMembers || [],
      });

      setCurrentUser({
        id: user.id,
        name: user.user_metadata?.name || user.email,
        email: user.email,
        role: data.userRole?.role || 'Membre',
        isAdmin: data.userRole?.isAdmin || false,
      });

      setIsAdmin(data.userRole?.isAdmin || false);
      setView('kanban');
    } catch (error) {
      console.error('Error loading kanban:', error);
      toast.error('Erreur lors du chargement du Kanban');
    } finally {
      setLoading(false);
    }
  };

  // Real-time sync callback
  const handleRealtimeUpdate = useCallback((data: any) => {
    if (!data) return;
    
    setKanbanData((prev) => {
      if (!prev) return null;
      
      return {
        ...prev,
        objectives: data.objectives || prev.objectives,
        tasks: data.tasks || prev.tasks,
        teamMembers: data.teamMembers || prev.teamMembers,
      };
    });
  }, []);

  // Enable real-time sync when viewing a kanban
  useRealtimeSync({
    kanbanId: kanbanData?.id || null,
    onUpdate: handleRealtimeUpdate,
    enabled: view === 'kanban' && !isAdmin, // Only sync for non-admin users
  });

  // Generate unique invite code
  const generateInviteCode = () => {
    const prefix = 'KAN';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `${prefix}-${code}`;
  };

  // Create new Kanban as owner
  const handleCreateOwner = async (name: string, kanbanTitle: string) => {
    try {
      setLoading(true);
      
      // Check if user is already authenticated
      let user = authApi.getCachedUser();
      
      if (!user) {
        // This shouldn't happen, but handle it gracefully
        toast.error('Veuillez vous connecter d\'abord');
        return;
      }

      // Create kanban
      const { kanban } = await kanbanApi.create(kanbanTitle);
      
      await loadKanban(kanban.id);
      setShowInviteCodeDisplay(true);
      toast.success(`Kanban "${kanbanTitle}" créé avec succès!`);
    } catch (error: any) {
      console.error('Error creating kanban:', error);
      toast.error(error.message || 'Erreur lors de la création du Kanban');
    } finally {
      setLoading(false);
    }
  };

  // Join existing Kanban as owner (login)
  const handleJoinAsOwner = async (email: string, password: string) => {
    try {
      setLoading(true);
      await authApi.signin(email, password);
      
      // Load user's kanbans
      const { kanbans } = await kanbanApi.getAll();
      
      if (kanbans && kanbans.length > 0) {
        await loadKanban(kanbans[0].id);
        toast.success('Connexion réussie!');
      } else {
        toast.info('Aucun Kanban trouvé. Créez-en un nouveau!');
        setView('auth');
      }
    } catch (error: any) {
      console.error('Error signing in:', error);
      toast.error(error.message || 'Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  // Join Kanban via invite link/code
  const handleJoinKanban = async (name: string, role: string) => {
    try {
      setLoading(true);

      // Join the kanban
      const { kanban } = await kanbanApi.join(pendingInviteCode, role);
      
      await loadKanban(kanban.id);
      setShowJoinDialog(false);
      toast.success(`Bienvenue ${name}!`);
    } catch (error: any) {
      console.error('Error joining kanban:', error);
      toast.error(error.message || 'Code d\'invitation invalide');
    } finally {
      setLoading(false);
    }
  };

  // Handle invite code display close
  const handleInviteCodeClose = () => {
    setShowInviteCodeDisplay(false);
    setView('kanban');
  };

  // Logout
  const handleLogout = async () => {
    try {
      await authApi.signout();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setCurrentUser(null);
      setKanbanData(null);
      setView('auth');
      setLoading(false);
      toast.info('Déconnecté avec succès');
    }
  };

  // Kanban CRUD operations
  const handleCreateObjective = async (objective: Omit<Objective, 'id'>) => {
    if (!kanbanData) return;
    
    try {
      // Save to backend
      const { objective: newObjective } = await objectiveApi.create({
        ...objective,
        kanbanId: kanbanData.id,
      });

      setKanbanData({
        ...kanbanData,
        objectives: [...kanbanData.objectives, newObjective],
      });
      toast.success('Objectif créé avec succès!');
    } catch (error: any) {
      console.error('Error creating objective:', error);
      toast.error(error.message || 'Erreur lors de la création de l\'objectif');
    }
  };

  const handleCreateTask = async (task: Omit<Task, 'id'>) => {
    if (!kanbanData) return;
    
    try {
      // Save to backend
      const { task: newTask } = await taskApi.create({
        ...task,
        kanbanId: kanbanData.id,
      });

      setKanbanData({
        ...kanbanData,
        tasks: [...kanbanData.tasks, newTask],
      });
      toast.success('Tâche créée avec succès!');
    } catch (error: any) {
      console.error('Error creating task:', error);
      toast.error(error.message || 'Erreur lors de la création de la tâche');
    }
  };

  const handleAssignTask = async (taskId: string, memberId: string) => {
    if (!kanbanData) return;
    
    try {
      const updates = {
        assignedTo: memberId,
        status: 'inProgress' as const,
        startedAt: new Date().toISOString(),
        elapsedHours: 0,
      };

      // Save to backend
      await taskApi.update(taskId, updates);

      setKanbanData({
        ...kanbanData,
        tasks: kanbanData.tasks.map((task) =>
          task.id === taskId ? { ...task, ...updates } : task
        ),
      });
      
      const member = kanbanData.teamMembers.find((m) => m.id === memberId);
      toast.success(`Tâche attribuée à ${member?.name}`);
    } catch (error: any) {
      console.error('Error assigning task:', error);
      toast.error(error.message || 'Erreur lors de l\'attribution de la tâche');
    }
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    if (!kanbanData) return;
    
    try {
      // Save to backend
      await taskApi.update(taskId, updates);

      setKanbanData({
        ...kanbanData,
        tasks: kanbanData.tasks.map((task) => (task.id === taskId ? { ...task, ...updates } : task)),
      });
    } catch (error: any) {
      console.error('Error updating task:', error);
      toast.error(error.message || 'Erreur lors de la mise à jour de la tâche');
    }
  };

  const handleMarkUrgent = async (taskId: string) => {
    if (!kanbanData) return;
    
    try {
      // Save to backend
      await taskApi.update(taskId, { status: 'urgent' });

      setKanbanData({
        ...kanbanData,
        tasks: kanbanData.tasks.map((task) =>
          task.id === taskId ? { ...task, status: 'urgent' } : task
        ),
      });
      toast.warning('Tâche marquée comme urgente');
    } catch (error: any) {
      console.error('Error marking task as urgent:', error);
      toast.error(error.message || 'Erreur lors du marquage de la tâche');
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    if (!kanbanData) return;
    const task = kanbanData.tasks.find((t) => t.id === taskId);
    if (!task) return;

    try {
      if (task.status === 'urgent') {
        // Save to backend
        await taskApi.update(taskId, { status: 'verification' });

        setKanbanData({
          ...kanbanData,
          tasks: kanbanData.tasks.map((t) =>
            t.id === taskId ? { ...t, status: 'verification' } : t
          ),
        });
        toast.info('Tâche envoyée en vérification');
      } else if (task.status === 'verification') {
        // Save to backend
        await taskApi.update(taskId, { 
          status: 'complete', 
          completedAt: new Date().toISOString() 
        });

        setKanbanData({
          ...kanbanData,
          tasks: kanbanData.tasks.map((t) =>
            t.id === taskId ? { ...t, status: 'complete', completedAt: new Date().toISOString() } : t
          ),
        });
        toast.success('Tâche marquée comme accomplie!');
      }
    } catch (error: any) {
      console.error('Error completing task:', error);
      toast.error(error.message || 'Erreur lors de la complétion de la tâche');
    }
  };

  const handleRedefineTask = async (taskId: string, completedPart: string, newTaskData: Omit<Task, 'id'>) => {
    if (!kanbanData) return;
    const originalTask = kanbanData.tasks.find((t) => t.id === taskId);
    if (!originalTask) return;

    try {
      // Delete original task and create two new ones
      await taskApi.delete(taskId);

      const completedTask: Omit<Task, 'id'> = {
        ...originalTask,
        title: `${originalTask.title} (Partie validée)`,
        description: completedPart,
        status: 'complete',
        completedAt: new Date().toISOString(),
      };

      const { task: completedTaskCreated } = await taskApi.create({
        ...completedTask,
        kanbanId: kanbanData.id,
      });

      const { task: correctionTaskCreated } = await taskApi.create({
        ...newTaskData,
        kanbanId: kanbanData.id,
      });

      setKanbanData({
        ...kanbanData,
        tasks: [...kanbanData.tasks.filter((t) => t.id !== taskId), completedTaskCreated, correctionTaskCreated],
      });
      toast.success('Tâche redéfinie avec succès');
    } catch (error: any) {
      console.error('Error redefining task:', error);
      toast.error(error.message || 'Erreur lors de la redéfinition de la tâche');
    }
  };

  const handleToggleChecklistItem = async (taskId: string, itemIndex: number) => {
    if (!kanbanData) return;
    
    const task = kanbanData.tasks.find((t) => t.id === taskId);
    if (!task) return;

    const newChecklist = [...task.checklist];
    newChecklist[itemIndex] = {
      ...newChecklist[itemIndex],
      completed: !newChecklist[itemIndex].completed,
    };

    const allCompleted = newChecklist.every((item) => item.completed);
    const newStatus = allCompleted && task.status === 'inProgress' ? 'verification' : task.status;

    try {
      // Save to backend
      await taskApi.update(taskId, {
        checklist: newChecklist,
        status: newStatus,
      });

      setKanbanData({
        ...kanbanData,
        tasks: kanbanData.tasks.map((t) => {
          if (t.id === taskId) {
            return {
              ...t,
              checklist: newChecklist,
              status: newStatus,
            };
          }
          return t;
        }),
      });
    } catch (error: any) {
      console.error('Error toggling checklist item:', error);
      toast.error(error.message || 'Erreur lors de la mise à jour de la checklist');
    }
  };

  // Simulate elapsed time
  useEffect(() => {
    if (!kanbanData) return;

    const interval = setInterval(() => {
      setKanbanData((prevData) => {
        if (!prevData) return prevData;
        return {
          ...prevData,
          tasks: prevData.tasks.map((task) => {
            if (task.status === 'inProgress' || task.status === 'urgent') {
              return {
                ...task,
                elapsedHours: (task.elapsedHours || 0) + 0.01,
              };
            }
            return task;
          }),
        };
      });
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [kanbanData]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (view === 'auth') {
    return (
      <>
        <Toaster position="top-right" />
        <AuthPage
          onCreateOwner={handleCreateOwner}
          onJoinAsOwner={handleJoinAsOwner}
        />
        {showJoinDialog && kanbanData && (
          <JoinKanbanDialog
            open={showJoinDialog}
            onOpenChange={setShowJoinDialog}
            kanbanTitle={kanbanData.title}
            inviteCode={pendingInviteCode}
            onJoin={handleJoinKanban}
          />
        )}
        {showInviteCodeDisplay && kanbanData && (
          <InviteCodeDisplay
            open={showInviteCodeDisplay}
            onOpenChange={handleInviteCodeClose}
            kanbanTitle={kanbanData.title}
            inviteCode={kanbanData.inviteCode}
            inviteLink={`${window.location.origin}?invite=${kanbanData.inviteCode}`}
          />
        )}
      </>
    );
  }

  if (!kanbanData || !currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Toaster position="top-right" />
      {view === 'kanban' ? (
        <KanbanBoard
          objectives={kanbanData.objectives}
          tasks={kanbanData.tasks}
          teamMembers={kanbanData.teamMembers}
          isAdmin={currentUser.isAdmin}
          kanbanTitle={kanbanData.title}
          inviteCode={kanbanData.inviteCode}
          onCreateObjective={handleCreateObjective}
          onCreateTask={handleCreateTask}
          onAssignTask={handleAssignTask}
          onUpdateTask={handleUpdateTask}
          onMarkUrgent={handleMarkUrgent}
          onCompleteTask={handleCompleteTask}
          onRedefineTask={handleRedefineTask}
          onToggleChecklistItem={handleToggleChecklistItem}
          onShowDashboard={() => setView('dashboard')}
          onLogout={handleLogout}
        />
      ) : (
        <Dashboard
          objectives={kanbanData.objectives}
          tasks={kanbanData.tasks}
          teamMembers={kanbanData.teamMembers}
          onClose={() => setView('kanban')}
        />
      )}
    </div>
  );
}

export default App;