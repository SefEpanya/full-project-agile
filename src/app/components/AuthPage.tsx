import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Sparkles, Users, Calendar, Target, LogIn } from 'lucide-react';
import { authApi } from '../../utils/api';
import { toast } from 'sonner';

interface AuthPageProps {
  onCreateOwner: (name: string, kanbanTitle: string) => void;
  onJoinAsOwner: (email: string, password: string) => void;
}

export function AuthPage({ onCreateOwner, onJoinAsOwner }: AuthPageProps) {
  // Create tab states
  const [createName, setCreateName] = useState('');
  const [createEmail, setCreateEmail] = useState('');
  const [createPassword, setCreatePassword] = useState('');
  const [kanbanTitle, setKanbanTitle] = useState('');
  const [creatingAccount, setCreatingAccount] = useState(false);

  // Login tab states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const handleCreateAccount = async () => {
    if (!createName.trim() || !createEmail.trim() || !createPassword.trim() || !kanbanTitle.trim()) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    if (createPassword.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    try {
      setCreatingAccount(true);
      // Create account
      await authApi.signup(createEmail, createPassword, createName);
      
      // Create kanban after account creation
      onCreateOwner(createName.trim(), kanbanTitle.trim());
    } catch (error: any) {
      console.error('Error creating account:', error);
      toast.error(error.message || 'Erreur lors de la création du compte');
      setCreatingAccount(false);
    }
  };

  const handleLogin = () => {
    if (!loginEmail.trim() || !loginPassword.trim()) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    onJoinAsOwner(loginEmail.trim(), loginPassword.trim());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-8 left-1/2 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl relative z-10"
      >
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left side - Branding */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center md:text-left space-y-6"
          >
            <div className="flex items-center justify-center md:justify-start gap-3">
              <motion.div
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                ISJ Event's
              </h1>
            </div>
            
            <p className="text-xl text-slate-700 font-medium">
              Plateforme de Gestion de Projet Kanban
            </p>
            
            <div className="space-y-4 pt-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-3 bg-white/70 backdrop-blur-sm rounded-lg p-4 shadow-sm"
              >
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Gestion d'objectifs</h3>
                  <p className="text-sm text-slate-600">Organisez vos projets par objectifs</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-3 bg-white/70 backdrop-blur-sm rounded-lg p-4 shadow-sm"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Collaboration d'équipe</h3>
                  <p className="text-sm text-slate-600">Travaillez ensemble en temps réel</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-3 bg-white/70 backdrop-blur-sm rounded-lg p-4 shadow-sm"
              >
                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Suivi du temps</h3>
                  <p className="text-sm text-slate-600">Visualisez la progression en temps réel</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right side - Auth Forms */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/95">
              <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-2xl text-center">Bienvenue !</CardTitle>
                <CardDescription className="text-center">
                  Créez votre Kanban ou accédez à un existant
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="create" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="create" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                      Créer un Kanban
                    </TabsTrigger>
                    <TabsTrigger value="join" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                      Se connecter
                    </TabsTrigger>
                  </TabsList>

                  {/* Create Kanban Tab */}
                  <TabsContent value="create" className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="owner-name">Votre nom complet *</Label>
                        <Input
                          id="owner-name"
                          placeholder="Ex: Marie Dupont"
                          value={createName}
                          onChange={(e) => setCreateName(e.target.value)}
                          className="border-2 focus:border-indigo-500 transition-colors"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="create-email">Email *</Label>
                        <Input
                          id="create-email"
                          type="email"
                          placeholder="Ex: marie@example.com"
                          value={createEmail}
                          onChange={(e) => setCreateEmail(e.target.value)}
                          className="border-2 focus:border-indigo-500 transition-colors"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="create-password">Mot de passe * (min. 6 caractères)</Label>
                        <Input
                          id="create-password"
                          type="password"
                          placeholder="••••••"
                          value={createPassword}
                          onChange={(e) => setCreatePassword(e.target.value)}
                          className="border-2 focus:border-indigo-500 transition-colors"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="kanban-title">Titre du projet Kanban *</Label>
                        <Input
                          id="kanban-title"
                          placeholder="Ex: Organisation ISJ Event's 2026"
                          value={kanbanTitle}
                          onChange={(e) => setKanbanTitle(e.target.value)}
                          className="border-2 focus:border-indigo-500 transition-colors"
                        />
                      </div>

                      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mt-4">
                        <p className="text-sm text-indigo-800">
                          <strong>ℹ️ Information :</strong> En créant un Kanban, vous deviendrez le{' '}
                          <strong>propriétaire/administrateur</strong>. Vous pourrez inviter d'autres membres
                          via un code d'accès qui sera généré automatiquement.
                        </p>
                      </div>

                      <Button
                        onClick={handleCreateAccount}
                        disabled={!createName.trim() || !kanbanTitle.trim() || !createEmail.trim() || !createPassword.trim() || creatingAccount}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                        size="lg"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        {creatingAccount ? 'Création...' : 'Créer mon Kanban'}
                      </Button>
                    </motion.div>
                  </TabsContent>

                  {/* Join Kanban Tab */}
                  <TabsContent value="join" className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="login-email">Email *</Label>
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="Ex: jean@example.com"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="border-2 focus:border-purple-500 transition-colors"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="login-password">Mot de passe *</Label>
                        <Input
                          id="login-password"
                          type="password"
                          placeholder="••••••"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="border-2 focus:border-purple-500 transition-colors"
                        />
                      </div>

                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-4">
                        <p className="text-sm text-purple-800">
                          <strong>ℹ️ Information :</strong> Connectez-vous avec votre compte
                          pour accéder à vos Kanbans existants.
                        </p>
                      </div>

                      <Button
                        onClick={handleLogin}
                        disabled={!loginEmail.trim() || !loginPassword.trim()}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                        size="lg"
                      >
                        <LogIn className="w-4 h-4 mr-2" />
                        Se connecter
                      </Button>
                    </motion.div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}