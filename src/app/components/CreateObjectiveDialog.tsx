import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Objective } from '../types';

interface CreateObjectiveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (objective: Omit<Objective, 'id'>) => void;
}

const COLORS = [
  { name: 'Bleu', value: '#3b82f6' },
  { name: 'Violet', value: '#8b5cf6' },
  { name: 'Rose', value: '#ec4899' },
  { name: 'Rouge', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Jaune', value: '#eab308' },
  { name: 'Vert', value: '#22c55e' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Fuchsia', value: '#d946ef' },
];

export function CreateObjectiveDialog({ open, onOpenChange, onCreate }: CreateObjectiveDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0].value);

  const handleSubmit = () => {
    if (!title.trim()) return;

    onCreate({
      title: title.trim(),
      description: description.trim(),
      color: selectedColor,
      createdAt: new Date(),
    });

    // Reset form
    setTitle('');
    setDescription('');
    setSelectedColor(COLORS[0].value);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Créer un objectif principal</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="objective-title">Titre de l'objectif *</Label>
            <Input
              id="objective-title"
              placeholder="Ex: Finaliser les Partenariats Pour ISJ EVENT'S"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="objective-description">Description (optionnel)</Label>
            <Textarea
              id="objective-description"
              placeholder="Décrivez l'objectif principal..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Color Selection */}
          <div className="space-y-2">
            <Label>Couleur d'identification *</Label>
            <div className="grid grid-cols-5 gap-3">
              {COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setSelectedColor(color.value)}
                  className={`w-full aspect-square rounded-lg transition-all hover:scale-110 ${
                    selectedColor === color.value
                      ? 'ring-4 ring-offset-2 ring-slate-400'
                      : 'hover:ring-2 ring-offset-2 ring-slate-300'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={!title.trim()}>
            Créer l'objectif
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
