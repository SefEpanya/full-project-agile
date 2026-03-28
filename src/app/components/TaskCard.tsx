import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Task, Objective, TeamMember } from '../types';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import {
  Clock,
  User,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Hammer,
  Users,
  DollarSign,
} from 'lucide-react';

interface TaskCardProps {
  task: Task;
  objective?: Objective;
  assignedMember?: TeamMember;
  isAdmin: boolean;
  onAssign: () => void;
  onMarkUrgent: () => void;
  onComplete: () => void;
  onRedefine: () => void;
  onToggleChecklistItem: (itemIndex: number) => void;
}

export function TaskCard({
  task,
  objective,
  assignedMember,
  isAdmin,
  onAssign,
  onMarkUrgent,
  onComplete,
  onRedefine,
  onToggleChecklistItem,
}: TaskCardProps) {
  const [expanded, setExpanded] = useState(false);

  const completedItems = task.checklist.filter((item) => item.completed).length;
  const totalItems = task.checklist.length;
  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border-l-4 overflow-hidden hover:shadow-2xl transition-all duration-300"
      style={{ borderLeftColor: objective?.color || '#6366f1' }}
    >
      {/* Card Header */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-slate-900 flex-1 pr-2">{task.title}</h3>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setExpanded(!expanded)}
            className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
          >
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </motion.button>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-slate-600 mb-1">
            <span>Progression</span>
            <motion.span
              key={`${completedItems}-${totalItems}`}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring" }}
            >
              {completedItems}/{totalItems}
            </motion.span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-2.5 rounded-full relative overflow-hidden"
              style={{ backgroundColor: objective?.color || '#6366f1' }}
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
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              />
            </motion.div>
          </div>
        </div>

        {/* Description (collapsed view) */}
        <AnimatePresence mode="wait">
          {!expanded && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-slate-600 line-clamp-2 mb-3"
            >
              {task.description}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Assigned Member & Duration */}
        <div className="flex items-center gap-4 text-xs text-slate-600">
          {assignedMember && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-full"
            >
              <User className="w-3.5 h-3.5" />
              <span className="font-medium">{assignedMember.name}</span>
            </motion.div>
          )}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-full"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>
              {task.status === 'inProgress' ? `${(task.elapsedHours || 0).toFixed(1)}h / ` : ''}
              {task.estimatedHours}h
            </span>
          </motion.div>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-slate-200 pt-4 space-y-4">
              {/* Full Description */}
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <p className="text-sm text-slate-700 mb-3">{task.description}</p>
              </motion.div>

              {/* Checklist */}
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
              >
                <h4 className="text-sm font-semibold text-slate-900 mb-2">Critères de validation</h4>
                <div className="space-y-2">
                  {task.checklist.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                      className="flex items-start gap-2 p-2 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <Checkbox
                        id={`checklist-${task.id}-${index}`}
                        checked={item.completed}
                        onCheckedChange={() => onToggleChecklistItem(index)}
                        disabled={!isAdmin || task.status === 'complete'}
                        className="mt-0.5"
                      />
                      <label
                        htmlFor={`checklist-${task.id}-${index}`}
                        className={`text-sm flex-1 cursor-pointer ${
                          item.completed ? 'line-through text-slate-400' : 'text-slate-700'
                        }`}
                      >
                        {item.text}
                      </label>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Resources */}
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h4 className="text-sm font-semibold text-slate-900 mb-2">Ressources</h4>
                <div className="space-y-2">
                  {task.resources.material.length > 0 && (
                    <div className="flex items-start gap-2 text-xs bg-blue-50 p-2 rounded-lg">
                      <Hammer className="w-3.5 h-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <span className="font-medium text-blue-900">Matérielles:</span>
                        <p className="text-blue-700 mt-0.5">{task.resources.material.join(', ')}</p>
                      </div>
                    </div>
                  )}
                  {task.resources.human.length > 0 && (
                    <div className="flex items-start gap-2 text-xs bg-purple-50 p-2 rounded-lg">
                      <Users className="w-3.5 h-3.5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <span className="font-medium text-purple-900">Humaines:</span>
                        <p className="text-purple-700 mt-0.5">{task.resources.human.join(', ')}</p>
                      </div>
                    </div>
                  )}
                  {task.resources.financial.length > 0 && (
                    <div className="flex items-start gap-2 text-xs bg-green-50 p-2 rounded-lg">
                      <DollarSign className="w-3.5 h-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <span className="font-medium text-green-900">Financières:</span>
                        <p className="text-green-700 mt-0.5">{task.resources.financial.join(', ')}</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      {isAdmin && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-4 pb-4 border-t border-slate-200 pt-3 space-y-2"
        >
          {task.status === 'tasks' && (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button onClick={onAssign} className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg" size="sm">
                <User className="w-4 h-4 mr-2" />
                Attribuer
              </Button>
            </motion.div>
          )}

          {(task.status === 'tasks' || task.status === 'inProgress') && (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button onClick={onMarkUrgent} className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg" size="sm">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Marquer urgent
              </Button>
            </motion.div>
          )}

          {task.status === 'urgent' && (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button onClick={onComplete} className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 shadow-lg" size="sm">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Terminer
              </Button>
            </motion.div>
          )}

          {task.status === 'verification' && (
            <>
              <motion.div
                animate={{
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="bg-gradient-to-r from-orange-100 to-yellow-100 border-2 border-orange-300 rounded-lg p-3 mb-2"
              >
                <p className="text-xs text-orange-900 text-center font-semibold flex items-center justify-center gap-2">
                  <motion.span
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ⏳
                  </motion.span>
                  En attente de vérification
                </p>
              </motion.div>
              <div className="grid grid-cols-2 gap-2">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={onComplete}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg"
                    size="sm"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Complet
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button onClick={onRedefine} variant="outline" size="sm" className="w-full border-2">
                    Redéfinir
                  </Button>
                </motion.div>
              </div>
            </>
          )}
        </motion.div>
      )}

      {/* Status Badge for Complete */}
      {task.status === 'complete' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 pb-4 border-t border-slate-200 pt-3"
        >
          <motion.div
            animate={{
              boxShadow: [
                '0 0 0 0px rgba(34, 197, 94, 0.4)',
                '0 0 0 10px rgba(34, 197, 94, 0)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <Badge className="w-full justify-center bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-600 hover:to-emerald-600 shadow-lg">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Tâche accomplie
            </Badge>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}