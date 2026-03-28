import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, X } from 'lucide-react';
import { Objective, Task, ChecklistItem } from '../types';

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  objectives: Objective[];
  onCreate: (task: Omit<Task, 'id'>) => void;
}

export function CreateTaskDialog({ open, onOpenChange, objectives, onCreate }: CreateTaskDialogProps) {
  const [objectiveId, setObjectiveId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('');
  const [checklist, setChecklist] = useState<string[]>(['']);
  const [materialResources, setMaterialResources] = useState<string[]>(['']);
  const [humanResources, setHumanResources] = useState<string[]>(['']);
  const [financialResources, setFinancialResources] = useState<string[]>(['']);

  const handleSubmit = () => {
    if (!title.trim() || !objectiveId || !estimatedHours) return;

    const checklistItems: ChecklistItem[] = checklist
      .filter((item) => item.trim())
      .map((item, index) => ({
        id: `check-${Date.now()}-${index}`,
        text: item.trim(),
        completed: false,
      }));

    onCreate({
      objectiveId,
      title: title.trim(),
      description: description.trim(),
      checklist: checklistItems,
      resources: {
        material: materialResources.filter((r) => r.trim()),
        human: humanResources.filter((r) => r.trim()),
        financial: financialResources.filter((r) => r.trim()),
      },
      estimatedHours: parseFloat(estimatedHours),
      status: 'tasks',
      createdAt: new Date(),
    });

    // Reset form
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setObjectiveId('');
    setTitle('');
    setDescription('');
    setEstimatedHours('');
    setChecklist(['']);
    setMaterialResources(['']);
    setHumanResources(['']);
    setFinancialResources(['']);
  };

  const addChecklistItem = () => setChecklist([...checklist, '']);
  const removeChecklistItem = (index: number) => setChecklist(checklist.filter((_, i) => i !== index));
  const updateChecklistItem = (index: number, value: string) => {
    const newChecklist = [...checklist];
    newChecklist[index] = value;
    setChecklist(newChecklist);
  };

  const addResource = (type: 'material' | 'human' | 'financial') => {
    if (type === 'material') setMaterialResources([...materialResources, '']);
    if (type === 'human') setHumanResources([...humanResources, '']);
    if (type === 'financial') setFinancialResources([...financialResources, '']);
  };

  const removeResource = (type: 'material' | 'human' | 'financial', index: number) => {
    if (type === 'material') setMaterialResources(materialResources.filter((_, i) => i !== index));
    if (type === 'human') setHumanResources(humanResources.filter((_, i) => i !== index));
    if (type === 'financial') setFinancialResources(financialResources.filter((_, i) => i !== index));
  };

  const updateResource = (type: 'material' | 'human' | 'financial', index: number, value: string) => {
    if (type === 'material') {
      const newResources = [...materialResources];
      newResources[index] = value;
      setMaterialResources(newResources);
    }
    if (type === 'human') {
      const newResources = [...humanResources];
      newResources[index] = value;
      setHumanResources(newResources);
    }
    if (type === 'financial') {
      const newResources = [...financialResources];
      newResources[index] = value;
      setFinancialResources(newResources);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle tâche</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Objective Selection */}
          <div className="space-y-2">
            <Label htmlFor="task-objective">Objectif principal *</Label>
            <Select value={objectiveId} onValueChange={setObjectiveId}>
              <SelectTrigger id="task-objective">
                <SelectValue placeholder="Sélectionner un objectif" />
              </SelectTrigger>
              <SelectContent>
                {objectives.map((objective) => (
                  <SelectItem key={objective.id} value={objective.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: objective.color }}
                      />
                      {objective.title}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="task-title">Titre de la tâche *</Label>
            <Input
              id="task-title"
              placeholder="Ex: Contacter les sponsors potentiels"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="task-description">Description *</Label>
            <Textarea
              id="task-description"
              placeholder="Décrivez la tâche en détail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Estimated Duration */}
          <div className="space-y-2">
            <Label htmlFor="task-duration">Durée estimée (heures) *</Label>
            <Input
              id="task-duration"
              type="number"
              min="0.5"
              step="0.5"
              placeholder="Ex: 8"
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(e.target.value)}
            />
          </div>

          {/* Checklist */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Critères de validation</Label>
              <Button type="button" size="sm" variant="outline" onClick={addChecklistItem}>
                <Plus className="w-4 h-4 mr-1" />
                Ajouter
              </Button>
            </div>
            <div className="space-y-2">
              {checklist.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Critère ${index + 1}`}
                    value={item}
                    onChange={(e) => updateChecklistItem(index, e.target.value)}
                  />
                  {checklist.length > 1 && (
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

          {/* Material Resources */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Ressources matérielles</Label>
              <Button type="button" size="sm" variant="outline" onClick={() => addResource('material')}>
                <Plus className="w-4 h-4 mr-1" />
                Ajouter
              </Button>
            </div>
            <div className="space-y-2">
              {materialResources.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Ex: Ordinateur, Projecteur..."
                    value={item}
                    onChange={(e) => updateResource('material', index, e.target.value)}
                  />
                  {materialResources.length > 1 && (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => removeResource('material', index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Human Resources */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Ressources humaines</Label>
              <Button type="button" size="sm" variant="outline" onClick={() => addResource('human')}>
                <Plus className="w-4 h-4 mr-1" />
                Ajouter
              </Button>
            </div>
            <div className="space-y-2">
              {humanResources.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Ex: Graphiste, Développeur..."
                    value={item}
                    onChange={(e) => updateResource('human', index, e.target.value)}
                  />
                  {humanResources.length > 1 && (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => removeResource('human', index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Financial Resources */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Ressources financières</Label>
              <Button type="button" size="sm" variant="outline" onClick={() => addResource('financial')}>
                <Plus className="w-4 h-4 mr-1" />
                Ajouter
              </Button>
            </div>
            <div className="space-y-2">
              {financialResources.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Ex: Budget marketing 5000€..."
                    value={item}
                    onChange={(e) => updateResource('financial', index, e.target.value)}
                  />
                  {financialResources.length > 1 && (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => removeResource('financial', index)}
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
          <Button onClick={handleSubmit} disabled={!title.trim() || !objectiveId || !estimatedHours}>
            Créer la tâche
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
