import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Task, TeamMember } from '../types';
import { User } from 'lucide-react';

interface AssignTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task;
  teamMembers: TeamMember[];
  onAssign: (memberId: string) => void;
}

export function AssignTaskDialog({
  open,
  onOpenChange,
  task,
  teamMembers,
  onAssign,
}: AssignTaskDialogProps) {
  const [selectedMember, setSelectedMember] = useState('');

  const handleSubmit = () => {
    if (!selectedMember) return;
    onAssign(selectedMember);
    setSelectedMember('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Attribuer la tâche</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
            <h4 className="font-semibold text-slate-900 mb-1">{task.title}</h4>
            <p className="text-sm text-slate-600">{task.description}</p>
          </div>

          <div className="space-y-2">
            <Label>Sélectionner un membre de l'équipe *</Label>
            <div className="grid gap-2">
              {teamMembers
                .filter((member) => !member.isAdmin)
                .map((member) => (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => setSelectedMember(member.id)}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                      selectedMember === member.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        selectedMember === member.id ? 'bg-blue-600' : 'bg-slate-200'
                      }`}
                    >
                      <User
                        className={`w-5 h-5 ${
                          selectedMember === member.id ? 'text-white' : 'text-slate-600'
                        }`}
                      />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-slate-900">{member.name}</p>
                      <p className="text-sm text-slate-600">{member.role}</p>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedMember}>
            Attribuer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
