import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TaskCard } from './TaskCard';
import { CreateTaskDialog } from './CreateTaskDialog';
import { CreateObjectiveDialog } from './CreateObjectiveDialog';
import { AssignTaskDialog } from './AssignTaskDialog';
import { RedefineTaskDialog } from './RedefineTaskDialog';
import { InviteCodeDisplay } from './InviteCodeDisplay';
import { Plus, BarChart3, Users, Share2, LogOut, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Objective, Task, TeamMember } from '../types';

interface KanbanBoardProps {
  objectives: Objective[];
  tasks: Task[];
  teamMembers: TeamMember[];
  isAdmin: boolean;
  kanbanTitle: string;
  inviteCode: string;
  onCreateObjective: (objective: Omit<Objective, 'id'>) => void;
  onCreateTask: (task: Omit<Task, 'id'>) => void;
  onAssignTask: (taskId: string, memberId: string) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onMarkUrgent: (taskId: string) => void;
  onCompleteTask: (taskId: string) => void;
  onRedefineTask: (taskId: string, completedPart: string, newTaskData: Omit<Task, 'id'>) => void;
  onToggleChecklistItem: (taskId: string, itemIndex: number) => void;
  onShowDashboard: () => void;
  onLogout: () => void;
}

export function KanbanBoard({
  objectives,
  tasks,
  teamMembers,
  isAdmin,
  kanbanTitle,
  inviteCode,
  onCreateObjective,
  onCreateTask,
  onAssignTask,
  onUpdateTask,
  onMarkUrgent,
  onCompleteTask,
  onRedefineTask,
  onToggleChecklistItem,
  onShowDashboard,
  onLogout,
}: KanbanBoardProps) {
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [createObjectiveOpen, setCreateObjectiveOpen] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [assignTaskDialog, setAssignTaskDialog] = useState<{ open: boolean; taskId: string | null }>({
    open: false,
    taskId: null,
  });
  const [redefineTaskDialog, setRedefineTaskDialog] = useState<{ open: boolean; taskId: string | null }>({
    open: false,
    taskId: null,
  });

  const columns = [
    { id: 'objectives', title: 'Objectifs Principaux', color: 'bg-gradient-to-br from-slate-50 to-slate-100', icon: '🎯' },
    { id: 'tasks', title: 'Tâches', color: 'bg-gradient-to-br from-blue-50 to-blue-100', icon: '📋' },
    { id: 'urgent', title: 'Urgent', color: 'bg-gradient-to-br from-red-50 to-red-100', icon: '⚡' },
    { id: 'inProgress', title: 'En cours', color: 'bg-gradient-to-br from-amber-50 to-amber-100', icon: '⚙️' },
    { id: 'duration', title: 'Durée / Période', color: 'bg-gradient-to-br from-purple-50 to-purple-100', icon: '⏱️' },
    { id: 'verification', title: 'Vérification', color: 'bg-gradient-to-br from-orange-50 to-orange-100', icon: '👁️' },
    { id: 'complete', title: 'Accompli', color: 'bg-gradient-to-br from-green-50 to-green-100', icon: '✅' },
  ];

  const getTasksByColumn = (columnId: string) => {
    if (columnId === 'objectives') return [];
    return tasks.filter((task) => task.status === columnId);
  };

  const handleAssignTask = (taskId: string, memberId: string) => {
    onAssignTask(taskId, memberId);
    setAssignTaskDialog({ open: false, taskId: null });
  };

  const handleRedefineTask = (taskId: string, completedPart: string, newTaskData: Omit<Task, 'id'>) => {
    onRedefineTask(taskId, completedPart, newTaskData);
    setRedefineTaskDialog({ open: false, taskId: null });
  };

  // Group tasks by objective for timeline visualization
  const getObjectivesWithTasks = () => {
    return objectives.map((objective) => {
      const objectiveTasks = tasks.filter((task) => task.objectiveId === objective.id);
      const totalDuration = objectiveTasks.reduce((sum, task) => sum + task.estimatedHours, 0);
      const completedDuration = objectiveTasks
        .filter((task) => task.status === 'complete')
        .reduce((sum, task) => sum + task.estimatedHours, 0);
      const elapsedDuration = objectiveTasks
        .filter((task) => task.status === 'inProgress' || task.status === 'urgent')
        .reduce((sum, task) => sum + (task.elapsedHours || 0), 0);

      return {
        ...objective,
        tasks: objectiveTasks,
        totalDuration,
        completedDuration,
        elapsedDuration,
        remainingDuration: totalDuration - completedDuration - elapsedDuration,
      };
    });
  };

  const inviteLink = `${window.location.origin}?invite=${inviteCode}`;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
        {/* Header */}
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-lg sticky top-0 z-10"
        >
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
                >
                  <Sparkles className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {kanbanTitle}
                  </h1>
                  <div className="flex items-center gap-3 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {inviteCode}
                    </Badge>
                    {isAdmin ? (
                      <Badge className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                        Administrateur
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Mode Consultation</Badge>
                    )}
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {teamMembers.length} membre{teamMembers.length > 1 ? 's' : ''}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={onShowDashboard}
                  variant="outline"
                  className="flex items-center gap-2 hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-300"
                >
                  <BarChart3 className="w-4 h-4" />
                  Dashboard
                </Button>
                {isAdmin && (
                  <>
                    <Button
                      onClick={() => setInviteDialogOpen(true)}
                      variant="outline"
                      className="flex items-center gap-2 hover:bg-purple-50 hover:border-purple-300 transition-all duration-300"
                    >
                      <Share2 className="w-4 h-4" />
                      Inviter
                    </Button>
                    <Button
                      onClick={() => setCreateObjectiveOpen(true)}
                      className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Plus className="w-4 h-4" />
                      Objectif
                    </Button>
                    <Button
                      onClick={() => setCreateTaskOpen(true)}
                      className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Plus className="w-4 h-4" />
                      Tâche
                    </Button>
                  </>
                )}
                <Button
                  onClick={onLogout}
                  variant="ghost"
                  className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 transition-all duration-300"
                >
                  <LogOut className="w-4 h-4" />
                  Déconnexion
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Kanban Board */}
        <div className="overflow-x-auto">
          <div className="inline-flex min-w-full p-6 gap-4">
            {columns.map((column, colIndex) => (
              <motion.div
                key={column.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: colIndex * 0.1, type: "spring" }}
                className="flex-shrink-0 w-80"
                style={{ minWidth: colIndex === 4 ? '400px' : '320px' }}
              >
                <div className={`${column.color} rounded-xl shadow-xl border border-white/50 h-full backdrop-blur-sm overflow-hidden`}>
                  {/* Column Header */}
                  <div className="p-4 border-b border-white/50 bg-white/30 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{column.icon}</span>
                      <h2 className="font-bold text-slate-800 text-lg">{column.title}</h2>
                    </div>
                    {column.id !== 'objectives' && column.id !== 'duration' && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: colIndex * 0.1 + 0.2 }}
                      >
                        <Badge variant="secondary" className="mt-2">
                          {getTasksByColumn(column.id).length} tâche{getTasksByColumn(column.id).length > 1 ? 's' : ''}
                        </Badge>
                      </motion.div>
                    )}
                  </div>

                  {/* Column Content */}
                  <div className="p-3 space-y-3 min-h-[calc(100vh-16rem)] max-h-[calc(100vh-16rem)] overflow-y-auto custom-scrollbar">
                    <AnimatePresence mode="popLayout">
                      {column.id === 'objectives' ? (
                        // Objectives Column
                        objectives.map((objective, index) => (
                          <motion.div
                            key={objective.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.02, y: -2 }}
                            className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg hover:shadow-xl border-l-4 transition-all duration-300"
                            style={{ borderLeftColor: objective.color }}
                          >
                            <div className="flex items-start gap-3">
                              <motion.div
                                animate={{
                                  boxShadow: [
                                    `0 0 0 0px ${objective.color}40`,
                                    `0 0 0 8px ${objective.color}00`,
                                  ],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                }}
                                className="w-5 h-5 rounded flex-shrink-0 mt-0.5"
                                style={{ backgroundColor: objective.color }}
                              />
                              <div className="flex-1">
                                <h3 className="font-semibold text-slate-900">{objective.title}</h3>
                                {objective.description && (
                                  <p className="text-sm text-slate-600 mt-1">{objective.description}</p>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))
                      ) : column.id === 'duration' ? (
                        // Duration/Timeline Column
                        <div className="space-y-4">
                          {getObjectivesWithTasks().map((objective, index) => (
                            <motion.div
                              key={objective.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              whileHover={{ scale: 1.02 }}
                              className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                              <div className="flex items-center gap-2 mb-3">
                                <div
                                  className="w-4 h-4 rounded"
                                  style={{ backgroundColor: objective.color }}
                                />
                                <h4 className="font-semibold text-sm text-slate-900">{objective.title}</h4>
                              </div>
                              
                              <div className="space-y-2 text-xs">
                                <div className="flex justify-between text-slate-600">
                                  <span>Total: {objective.totalDuration}h</span>
                                  <span>Complété: {objective.completedDuration}h</span>
                                </div>
                                <div className="flex justify-between text-slate-600">
                                  <span>En cours: {objective.elapsedDuration.toFixed(1)}h</span>
                                  <span>Restant: {objective.remainingDuration.toFixed(1)}h</span>
                                </div>
                                
                                {/* Progress bar */}
                                <div className="w-full bg-slate-200 rounded-full h-2.5 mt-2 overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(objective.completedDuration / objective.totalDuration) * 100}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="h-2.5 rounded-full relative overflow-hidden"
                                    style={{ backgroundColor: objective.color }}
                                  >
                                    <motion.div
                                      animate={{
                                        x: ['-100%', '100%'],
                                      }}
                                      transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "linear"
                                      }}
                                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                    />
                                  </motion.div>
                                </div>

                                {/* Timeline */}
                                {objective.tasks.length > 0 && (
                                  <div className="mt-3 pt-3 border-t border-slate-200">
                                    <p className="text-slate-500 mb-2">Chronologie</p>
                                    <div className="space-y-1">
                                      {objective.tasks.map((task, taskIndex) => (
                                        <motion.div
                                          key={task.id}
                                          initial={{ opacity: 0, x: -10 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          transition={{ delay: taskIndex * 0.05 }}
                                          className="flex items-center gap-2 text-xs"
                                        >
                                          <div
                                            className="w-2 h-2 rounded-full"
                                            style={{ backgroundColor: objective.color }}
                                          />
                                          <span className="text-slate-700 truncate flex-1">{task.title}</span>
                                          <span className="text-slate-500">{task.estimatedHours}h</span>
                                        </motion.div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        // Task Cards
                        getTasksByColumn(column.id).map((task, index) => {
                          const objective = objectives.find((obj) => obj.id === task.objectiveId);
                          const assignedMember = teamMembers.find((m) => m.id === task.assignedTo);

                          return (
                            <motion.div
                              key={task.id}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{ delay: index * 0.05 }}
                              layout
                            >
                              <TaskCard
                                task={task}
                                objective={objective}
                                assignedMember={assignedMember}
                                isAdmin={isAdmin}
                                onAssign={() => setAssignTaskDialog({ open: true, taskId: task.id })}
                                onMarkUrgent={() => onMarkUrgent(task.id)}
                                onComplete={() => onCompleteTask(task.id)}
                                onRedefine={() => setRedefineTaskDialog({ open: true, taskId: task.id })}
                                onToggleChecklistItem={(itemIndex) => onToggleChecklistItem(task.id, itemIndex)}
                              />
                            </motion.div>
                          );
                        })
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Dialogs */}
        {isAdmin && (
          <>
            <CreateObjectiveDialog
              open={createObjectiveOpen}
              onOpenChange={setCreateObjectiveOpen}
              onCreate={onCreateObjective}
            />
            <CreateTaskDialog
              open={createTaskOpen}
              onOpenChange={setCreateTaskOpen}
              objectives={objectives}
              onCreate={onCreateTask}
            />
            <InviteCodeDisplay
              open={inviteDialogOpen}
              onOpenChange={setInviteDialogOpen}
              kanbanTitle={kanbanTitle}
              inviteCode={inviteCode}
              inviteLink={inviteLink}
            />
            {assignTaskDialog.taskId && (
              <AssignTaskDialog
                open={assignTaskDialog.open}
                onOpenChange={(open) => setAssignTaskDialog({ open, taskId: null })}
                task={tasks.find((t) => t.id === assignTaskDialog.taskId)!}
                teamMembers={teamMembers}
                onAssign={(memberId) => handleAssignTask(assignTaskDialog.taskId!, memberId)}
              />
            )}
            {redefineTaskDialog.taskId && (
              <RedefineTaskDialog
                open={redefineTaskDialog.open}
                onOpenChange={(open) => setRedefineTaskDialog({ open, taskId: null })}
                task={tasks.find((t) => t.id === redefineTaskDialog.taskId)!}
                objective={objectives.find(
                  (obj) => obj.id === tasks.find((t) => t.id === redefineTaskDialog.taskId)?.objectiveId
                )!}
                onRedefine={(completedPart, newTaskData) =>
                  handleRedefineTask(redefineTaskDialog.taskId!, completedPart, newTaskData)
                }
              />
            )}
          </>
        )}
      </div>
    </DndProvider>
  );
}