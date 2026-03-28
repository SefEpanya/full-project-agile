import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { UserPlus, Briefcase } from 'lucide-react';

interface JoinKanbanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kanbanTitle: string;
  inviteCode: string;
  onJoin: (name: string, role: string) => void;
}

const ROLES = [
  'Coordinateur Communication',
  'Responsable Partenariats',
  'Gestionnaire Logistique',
  'Chargé Marketing',
  'Designer Graphique',
  'Community Manager',
  'Développeur',
  'Chef de projet adjoint',
  'Assistant',
  'Autre',
];

export function JoinKanbanDialog({ open, onOpenChange, kanbanTitle, inviteCode, onJoin }: JoinKanbanDialogProps) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [customRole, setCustomRole] = useState('');

  const handleJoin = () => {
    const finalRole = role === 'Autre' ? customRole : role;
    if (name.trim() && finalRole.trim()) {
      onJoin(name.trim(), finalRole.trim());
      setName('');
      setRole('');
      setCustomRole('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-white to-purple-50 border-2 border-purple-200">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Rejoindre le Kanban
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 py-4"
        >
          {/* Kanban Info */}
          <div className="bg-white rounded-lg p-4 border-2 border-purple-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-600">Projet :</span>
              <span className="text-sm font-mono bg-purple-100 px-2 py-1 rounded">{inviteCode}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">{kanbanTitle}</h3>
          </div>

          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="member-name" className="flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-purple-600" />
              Votre nom complet *
            </Label>
            <Input
              id="member-name"
              placeholder="Ex: Sophie Laurent"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-2 border-purple-200 focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <Label htmlFor="member-role" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-purple-600" />
              Votre fonction *
            </Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger id="member-role" className="border-2 border-purple-200 focus:border-purple-500">
                <SelectValue placeholder="Sélectionner votre rôle" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Custom Role Input */}
          {role === 'Autre' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              <Label htmlFor="custom-role">Précisez votre fonction *</Label>
              <Input
                id="custom-role"
                placeholder="Ex: Responsable technique"
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                className="border-2 border-purple-200 focus:border-purple-500"
              />
            </motion.div>
          )}

          {/* Join Button */}
          <Button
            onClick={handleJoin}
            disabled={!name.trim() || !role || (role === 'Autre' && !customRole.trim())}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            size="lg"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Rejoindre l'équipe
          </Button>

          <p className="text-xs text-center text-slate-600">
            En rejoignant, vous aurez accès au tableau Kanban en mode consultation.
            Seul l'administrateur peut modifier les tâches.
          </p>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
