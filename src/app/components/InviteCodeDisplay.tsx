import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Copy, Check, Share2, QrCode } from 'lucide-react';
import { toast } from 'sonner';

interface InviteCodeDisplayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kanbanTitle: string;
  inviteCode: string;
  inviteLink: string;
}

export function InviteCodeDisplay({ open, onOpenChange, kanbanTitle, inviteCode, inviteLink }: InviteCodeDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    toast.success('Code copié !');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setLinkCopied(true);
    toast.success('Lien copié !');
    setTimeout(() => setLinkCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] bg-gradient-to-br from-white to-indigo-50 border-2 border-indigo-200">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Inviter des membres
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 py-4"
        >
          {/* Success Message */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-4 text-center"
          >
            <div className="w-12 h-12 bg-green-500 rounded-full mx-auto mb-3 flex items-center justify-center">
              <Check className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-green-900 mb-1">Kanban créé avec succès !</h3>
            <p className="text-sm text-green-700">{kanbanTitle}</p>
          </motion.div>

          {/* Invite Code */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-slate-900">Code d'accès</h4>
              <Share2 className="w-4 h-4 text-indigo-600" />
            </div>
            
            <div className="relative">
              <div className="bg-white border-2 border-indigo-300 rounded-lg p-6 text-center">
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="font-mono text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-wider"
                >
                  {inviteCode}
                </motion.div>
              </div>
              
              <Button
                onClick={handleCopyCode}
                className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700 transition-all duration-300"
                size="lg"
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Copié !
                    </motion.div>
                  ) : (
                    <motion.div
                      key="copy"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      Copier le code
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </div>
          </div>

          {/* Invite Link */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-900">Lien d'invitation</h4>
            
            <div className="bg-white border-2 border-purple-200 rounded-lg p-4">
              <p className="text-sm text-slate-600 font-mono break-all">{inviteLink}</p>
            </div>
            
            <Button
              onClick={handleCopyLink}
              variant="outline"
              className="w-full border-2 border-purple-300 hover:bg-purple-50 transition-all duration-300"
              size="lg"
            >
              <AnimatePresence mode="wait">
                {linkCopied ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Lien copié !
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copier le lien
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>

          {/* Instructions */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <h4 className="font-semibold text-indigo-900 mb-2 flex items-center gap-2">
              <QrCode className="w-4 h-4" />
              Comment inviter ?
            </h4>
            <ul className="space-y-2 text-sm text-indigo-800">
              <li className="flex items-start gap-2">
                <span className="font-bold">1.</span>
                <span>Partagez le <strong>code d'accès</strong> ou le <strong>lien</strong> avec vos membres</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">2.</span>
                <span>Ils devront entrer leur nom et fonction pour rejoindre</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">3.</span>
                <span>Ils auront accès au Kanban en mode consultation</span>
              </li>
            </ul>
          </div>

          <Button
            onClick={() => onOpenChange(false)}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            size="lg"
          >
            Commencer à utiliser mon Kanban
          </Button>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
