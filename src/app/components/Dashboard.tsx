import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowLeft, Target, ListTodo, CheckCircle2, Clock, AlertTriangle, Eye, Users } from 'lucide-react';
import { Objective, Task, TeamMember } from '../types';

interface DashboardProps {
  objectives: Objective[];
  tasks: Task[];
  teamMembers: TeamMember[];
  onClose: () => void;
}

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

export function Dashboard({ objectives, tasks, teamMembers, onClose }: DashboardProps) {
  // Calculate statistics
  const stats = {
    totalObjectives: objectives.length,
    totalTasks: tasks.length,
    completedTasks: tasks.filter((t) => t.status === 'complete').length,
    inProgressTasks: tasks.filter((t) => t.status === 'inProgress').length,
    urgentTasks: tasks.filter((t) => t.status === 'urgent').length,
    verificationTasks: tasks.filter((t) => t.status === 'verification').length,
    pendingTasks: tasks.filter((t) => t.status === 'tasks').length,
    totalHours: tasks.reduce((sum, t) => sum + t.estimatedHours, 0),
    completedHours: tasks
      .filter((t) => t.status === 'complete')
      .reduce((sum, t) => sum + t.estimatedHours, 0),
    inProgressHours: tasks
      .filter((t) => t.status === 'inProgress')
      .reduce((sum, t) => sum + (t.elapsedHours || 0), 0),
    teamMembers: teamMembers.length,
  };

  const completionRate = stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0;
  const hourCompletionRate = stats.totalHours > 0 ? (stats.completedHours / stats.totalHours) * 100 : 0;

  // Data for charts
  const taskStatusData = [
    { name: 'En attente', value: stats.pendingTasks, color: '#3b82f6' },
    { name: 'En cours', value: stats.inProgressTasks, color: '#f59e0b' },
    { name: 'Urgent', value: stats.urgentTasks, color: '#ef4444' },
    { name: 'Vérification', value: stats.verificationTasks, color: '#f97316' },
    { name: 'Accompli', value: stats.completedTasks, color: '#10b981' },
  ];

  const objectiveProgressData = objectives.map((obj) => {
    const objTasks = tasks.filter((t) => t.objectiveId === obj.id);
    const completed = objTasks.filter((t) => t.status === 'complete').length;
    const inProgress = objTasks.filter((t) => t.status === 'inProgress' || t.status === 'urgent').length;
    const pending = objTasks.filter((t) => t.status === 'tasks' || t.status === 'verification').length;

    return {
      name: obj.title.length > 20 ? obj.title.substring(0, 20) + '...' : obj.title,
      'Accompli': completed,
      'En cours': inProgress,
      'En attente': pending,
      color: obj.color,
    };
  });

  const memberWorkloadData = teamMembers
    .filter((m) => !m.isAdmin)
    .map((member) => {
      const assignedTasks = tasks.filter((t) => t.assignedTo === member.id);
      const completed = assignedTasks.filter((t) => t.status === 'complete').length;
      const inProgress = assignedTasks.filter((t) => t.status === 'inProgress' || t.status === 'urgent').length;

      return {
        name: member.name,
        'Tâches actives': inProgress,
        'Tâches complétées': completed,
      };
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Tableau de bord</h1>
              <p className="text-sm text-slate-600 mt-1">Statistiques et évolution du projet ISJ Event's</p>
            </div>
            <Button onClick={onClose} variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Retour au Kanban
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Objectifs principaux</CardTitle>
              <Target className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalObjectives}</div>
              <p className="text-xs text-slate-600 mt-1">Objectifs définis</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tâches totales</CardTitle>
              <ListTodo className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTasks}</div>
              <p className="text-xs text-slate-600 mt-1">
                {stats.completedTasks} complétées ({completionRate.toFixed(0)}%)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Heures totales</CardTitle>
              <Clock className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalHours}h</div>
              <p className="text-xs text-slate-600 mt-1">
                {stats.completedHours}h complétées ({hourCompletionRate.toFixed(0)}%)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Membres d'équipe</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.teamMembers}</div>
              <p className="text-xs text-slate-600 mt-1">Collaborateurs actifs</p>
            </CardContent>
          </Card>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="border-l-4 border-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <ListTodo className="h-4 w-4" />
                En attente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingTasks}</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-amber-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                En cours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inProgressTasks}</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-red-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Urgent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.urgentTasks}</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-orange-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Vérification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.verificationTasks}</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Accompli
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedTasks}</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Task Distribution Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Répartition des tâches</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={taskStatusData.filter((d) => d.value > 0)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {taskStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Objectives Progress Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Progression par objectif</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={objectiveProgressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Accompli" stackId="a" fill="#10b981" />
                  <Bar dataKey="En cours" stackId="a" fill="#f59e0b" />
                  <Bar dataKey="En attente" stackId="a" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Member Workload */}
        {memberWorkloadData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Charge de travail par membre</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={memberWorkloadData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Tâches actives" fill="#f59e0b" />
                  <Bar dataKey="Tâches complétées" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Objectives Details */}
        <Card>
          <CardHeader>
            <CardTitle>Détails des objectifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {objectives.map((objective) => {
                const objTasks = tasks.filter((t) => t.objectiveId === objective.id);
                const completed = objTasks.filter((t) => t.status === 'complete').length;
                const total = objTasks.length;
                const progress = total > 0 ? (completed / total) * 100 : 0;
                const totalHours = objTasks.reduce((sum, t) => sum + t.estimatedHours, 0);
                const completedHours = objTasks
                  .filter((t) => t.status === 'complete')
                  .reduce((sum, t) => sum + t.estimatedHours, 0);

                return (
                  <div key={objective.id} className="border-l-4 pl-4 py-2" style={{ borderLeftColor: objective.color }}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900">{objective.title}</h4>
                        {objective.description && (
                          <p className="text-sm text-slate-600 mt-1">{objective.description}</p>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-sm font-semibold text-slate-900">
                          {completed}/{total} tâches
                        </p>
                        <p className="text-xs text-slate-600">
                          {completedHours}/{totalHours}h
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${progress}%`,
                          backgroundColor: objective.color,
                        }}
                      />
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{progress.toFixed(0)}% complété</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
