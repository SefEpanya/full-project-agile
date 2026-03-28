# Guide d'utilisation - Application ISJ Event's Kanban avec Backend

## 🎉 Bienvenue !

Votre application Kanban ISJ Event's est maintenant complète avec :
- ✅ Authentification sécurisée via Supabase
- ✅ Persistance des données en temps réel
- ✅ Synchronisation automatique entre tous les membres
- ✅ Gestion des rôles (Propriétaire vs Membres)
- ✅ Codes d'invitation uniques pour chaque Kanban

## 📋 Fonctionnalités Implémentées

### 1. **Authentification Complète**

#### Inscription (Créer un Kanban)
- Remplissez votre nom complet
- Entrez votre email
- Créez un mot de passe (minimum 6 caractères)
- Nommez votre projet Kanban
- Cliquez sur "Créer mon Kanban"

→ Votre compte est créé automatiquement et votre premier Kanban est généré avec un code d'invitation unique !

#### Connexion (Accéder à un Kanban existant)
- Entrez votre email
- Entrez votre mot de passe
- Cliquez sur "Se connecter"

→ Vous êtes redirigé vers votre Kanban principal

### 2. **Gestion des Kanbans**

#### Propriétaire (Administrateur)
En tant que propriétaire, vous pouvez :
- ✅ Créer des objectifs
- ✅ Créer des tâches
- ✅ Modifier et supprimer des tâches
- ✅ Attribuer des tâches aux membres
- ✅ Marquer des tâches comme urgentes
- ✅ Valider des tâches
- ✅ Redéfinir des tâches
- ✅ Inviter des membres via le code d'invitation

#### Membres (Consultation uniquement)
En tant que membre invité, vous pouvez :
- 👁️ Consulter tous les objectifs et tâches
- 📊 Voir le dashboard analytique
- 🔄 Recevoir les mises à jour en temps réel (toutes les 5 secondes)

### 3. **Système d'Invitation**

Après avoir créé un Kanban, vous recevez :
- Un **code d'invitation** unique (ex: KAN-ABC123)
- Un **lien d'invitation** partageable

**Pour inviter un membre :**
1. Partagez le code d'invitation ou le lien
2. Le membre doit créer un compte (si nouveau)
3. Le membre entre le code d'invitation
4. Le membre a accès au Kanban en lecture seule

### 4. **Persistance des Données**

Toutes vos données sont sauvegardées automatiquement :
- ✅ Création d'objectifs → Sauvegardé dans Supabase
- ✅ Création de tâches → Sauvegardé dans Supabase
- ✅ Modification de tâches → Sauvegardé dans Supabase
- ✅ Attribution de tâches → Sauvegardé dans Supabase
- ✅ Changement de statut → Sauvegardé dans Supabase

**Vous pouvez vous déconnecter et revenir plus tard : toutes vos données seront là !**

### 5. **Synchronisation en Temps Réel**

L'application utilise un système de polling (rafraîchissement toutes les 5 secondes) pour les membres non-admin :

- Le propriétaire modifie une tâche → Tous les membres voient la mise à jour en quelques secondes
- Le propriétaire crée un objectif → Tous les membres le voient automatiquement
- Le propriétaire attribue une tâche → La personne assignée le voit instantanément

## 🔐 Sécurité

### Row Level Security (RLS)
Les données sont protégées par :
- Authentification obligatoire pour accéder aux Kanbans
- Vérification des permissions pour chaque action
- Seuls les membres autorisés peuvent voir un Kanban
- Seul le propriétaire peut modifier le Kanban

### Gestion des Sessions
- Les sessions sont stockées de manière sécurisée
- Déconnexion automatique après expiration
- Tokens d'accès chiffrés

## 📊 Structure des Données Backend

### Base de Données (KV Store)

L'application utilise le système de clé-valeur Supabase pour stocker :

#### Kanbans
```
kanban:{kanbanId} → {
  id, title, inviteCode, ownerId, ownerName, createdAt, updatedAt
}
```

#### Codes d'Invitation
```
invite:{inviteCode} → kanbanId
```

#### Accès Utilisateur
```
user:{userId}:kanban:{kanbanId} → {
  role, isAdmin, joinedAt
}
```

#### Objectifs
```
objective:{objectiveId} → {
  id, kanbanId, title, description, color, createdAt
}
```

#### Tâches
```
task:{taskId} → {
  id, objectiveId, kanbanId, title, description, checklist, 
  resources, estimatedHours, elapsedHours, status, assignedTo,
  createdAt, startedAt, completedAt
}
```

## 🚀 Workflow Complet

### Scénario 1 : Créer et Gérer un Kanban

1. **Inscription**
   - Ouvrez l'application
   - Onglet "Créer un Kanban"
   - Remplissez : Nom, Email, Mot de passe, Titre du Kanban
   - Cliquez sur "Créer mon Kanban"

2. **Code d'invitation**
   - Notez votre code d'invitation (ex: KAN-ABC123)
   - Ou copiez le lien d'invitation
   - Cliquez sur "Commencer" pour accéder au Kanban

3. **Gestion du Kanban**
   - Créez des objectifs avec le bouton "+"
   - Créez des tâches pour chaque objectif
   - Attribuez des tâches aux membres
   - Suivez la progression dans le Dashboard

4. **Invitation de Membres**
   - Partagez le code ou le lien d'invitation
   - Les membres créent un compte
   - Les membres rejoignent avec le code
   - Ils peuvent maintenant consulter le Kanban

### Scénario 2 : Rejoindre un Kanban en tant que Membre

1. **Création de Compte**
   - Recevez le code d'invitation du propriétaire
   - Ouvrez l'application
   - Onglet "Créer un Kanban" (pour créer un compte)
   - Remplissez : Nom, Email, Mot de passe
   - **Important** : Créez un Kanban temporaire (vous pourrez le supprimer plus tard)

2. **Rejoindre le Kanban**
   - Déconnectez-vous
   - Utilisez le lien d'invitation ou entrez le code manuellement
   - Vous êtes maintenant membre du Kanban !

## 🔧 API Backend

### Routes Disponibles

#### Authentification
- `POST /auth/signup` - Créer un compte
- `POST /auth/signin` - Se connecter
- `POST /auth/signout` - Se déconnecter
- `GET /auth/me` - Obtenir l'utilisateur actuel

#### Kanbans
- `POST /kanbans` - Créer un Kanban
- `GET /kanbans` - Liste des Kanbans de l'utilisateur
- `GET /kanbans/:id` - Détails d'un Kanban
- `POST /kanbans/join` - Rejoindre via code d'invitation

#### Objectifs
- `POST /objectives` - Créer un objectif (admin uniquement)

#### Tâches
- `POST /tasks` - Créer une tâche (admin uniquement)
- `PUT /tasks/:id` - Modifier une tâche (admin uniquement)
- `DELETE /tasks/:id` - Supprimer une tâche (admin uniquement)

## ⚠️ Limitations Actuelles

1. **Temps Réel** : Utilise du polling toutes les 5 secondes (pas de WebSocket)
2. **Pagination** : Pas de pagination pour les grandes listes
3. **Historique** : Pas d'historique des modifications
4. **Export** : Pas encore d'export PDF/Excel
5. **Recherche** : Pas de fonction de recherche avancée

## 🎯 Prochaines Améliorations Possibles

- [ ] Implémenter Supabase Realtime avec WebSocket
- [ ] Ajouter la pagination pour les grandes listes
- [ ] Historique des modifications
- [ ] Export PDF/Excel
- [ ] Recherche et filtres avancés
- [ ] Notifications push
- [ ] Archivage des Kanbans terminés
- [ ] Personnalisation des thèmes

## 📞 Support

Pour toute question ou problème :
1. Vérifiez que Supabase est bien connecté
2. Consultez la console du navigateur pour les erreurs
3. Vérifiez votre connexion internet
4. Assurez-vous que votre email/mot de passe sont corrects

## 🎨 Design et Animations

L'application conserve toutes les animations et le design moderne :
- Animations fluides avec Motion/React
- Effets de glassmorphism
- Dégradés colorés
- Transitions élégantes
- Interface responsive

---

**Développé pour ISJ Event's** 🚀

Profitez de votre application Kanban complète avec persistance des données et collaboration en temps réel !
