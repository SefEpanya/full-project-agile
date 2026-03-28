import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Task, Objective, ChecklistItem } from '../types';
import { Plus, X } from 'lucide-react';

interface RedefineTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task;
  objective: Objective;
  onRedefine: (completedPart: string, newTaskData: Omit<Task, 'id'>) => void;
}

export function RedefineTaskDialog({
  open,
  onOpenChange,
  task,
  objective,
  onRedefine,
}: RedefineTaskDialogProps) {
  const [completedPart, setCompletedPart] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newEstimatedHours, setNewEstimatedHours] = useState('');
  const [newChecklist, setNewChecklist] = useState<string[]>(['']);

  const handleSubmit = () => {
    if (!completedPart.trim() || !newTitle.trim() || !newEstimatedHours) return;

    const checklistItems: ChecklistItem[] = newChecklist
      .filter((item) => item.trim())
      .map((item, index) => ({
        id: `check-${Date.now()}-${index}`,
        text: item.trim(),
        completed: false,
      }));

    onRedefine(completedPart.trim(), {
      objectiveId: task.objectiveId,
      title: newTitle.trim(),
      description: newDescription.trim(),
      checklist: checklistItems,
      resources: task.resources,
      estimatedHours: parseFloat(newEstimatedHours),
      status: 'tasks',
      createdAt: new Date(),
    });

    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setCompletedPart('');
    setNewTitle('');
    setNewDescription('');
    setNewEstimatedHours('');
    setNewChecklist(['']);
  };

  const addChecklistItem = () => setNewChecklist([...newChecklist, '']);
  const removeChecklistItem = (index: number) => setNewChecklist(newChecklist.filter((_, i) => i !== index));
  const updateChecklistItem = (index: number, value: string) => {
    const newList = [...newChecklist];
    newList[index] = value;
    setNewChecklist(newList);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Redéfinir la tâche</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Original Task Info */}
          <div
            className="bg-slate-50 rounded-lg p-4 border-l-4"
            style={{ borderLeftColor: objective.color }}
          >
            <h4 className="font-semibold text-slate-900 mb-1">Tâche originale</h4>
            <p className="text-sm text-slate-700">{task.title}</p>
            <p className="text-sm text-slate-600 mt-1">{task.description}</p>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <p className="text-sm text-slate-700 mb-4">
              La tâche sera divisée en deux parties : une partie validée (envoyée en "Accompli") et une
              nouvelle tâche pour les points à revoir (envoyée en "Tâches").
            </p>
          </div>

          {/* Completed Part */}
          <div className="space-y-2">
            <Label htmlFor="completed-part">Partie validée (description) *</Label>
            <Textarea
              id="completed-part"
              placeholder="Décrivez ce qui a été correctement réalisé..."
              value={completedPart}
              onChange={(e) => setCompletedPart(e.target.value)}
              rows={2}
            />
          </div>

          <div className="border-t border-slate-200 pt-4">
            <h4 className="font-semibold text-slate-900 mb-3">Nouvelle tâche (points à revoir)</h4>
          </div>

          {/* New Task Title */}
          <div className="space-y-2">
            <Label htmlFor="new-title">Titre de la nouvelle tâche *</Label>
            <Input
              id="new-title"
              placeholder="Ex: Correction des points à revoir"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </div>

          {/* New Task Description */}
          <div className="space-y-2">
            <Label htmlFor="new-description">Description *</Label>
            <Textarea
              id="new-description"
              placeholder="Décrivez les corrections à apporter..."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* New Estimated Duration */}
          <div className="space-y-2">
            <Label htmlFor="new-duration">Durée estimée (heures) *</Label>
            <Input
              id="new-duration"
              type="number"
              min="0.5"
              step="0.5"
              placeholder="Ex: 4"
              value={newEstimatedHours}
              onChange={(e) => setNewEstimatedHours(e.target.value)}
            />
          </div>

          {/* New Checklist */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Nouveaux critères de validation</Label>
              <Button type="button" size="sm" variant="outline" onClick={addChecklistItem}>
                <Plus className="w-4 h-4 mr-1" />
                Ajouter
              </Button>
            </div>
            <div className="space-y-2">
              {newChecklist.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Critère ${index + 1}`}
                    value={item}
                    onChange={(e) => updateChecklistItem(index, e.target.value)}
                  />
                  {newChecklist.length > 1 && (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => removeChecklistItem(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!completedPart.trim() || !newTitle.trim() || !newEstimatedHours}
          >
            Redéfinir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
