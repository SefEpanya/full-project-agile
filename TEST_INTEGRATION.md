# Test d'Intégration Backend - ISJ Event's Kanban

## ✅ Checklist de Vérification

### 1. Authentification
- [ ] Inscription avec email/mot de passe fonctionne
- [ ] Connexion avec credentials existants fonctionne
- [ ] Déconnexion fonctionne
- [ ] Session persiste après rafraîchissement
- [ ] Messages d'erreur s'affichent correctement

### 2. Création de Kanban
- [ ] Création de Kanban génère un code unique
- [ ] Code d'invitation s'affiche correctement
- [ ] Lien d'invitation est généré
- [ ] Objectif et tâche de démo sont créés

### 3. Gestion des Tâches
- [ ] Création d'objectif fonctionne
- [ ] Création de tâche fonctionne
- [ ] Attribution de tâche fonctionne
- [ ] Modification de statut fonctionne
- [ ] Marquage comme urgent fonctionne
- [ ] Validation de tâche fonctionne
- [ ] Toggle checklist fonctionne

### 4. Permissions
- [ ] Admin peut créer/modifier/supprimer
- [ ] Membre peut seulement consulter
- [ ] Erreurs appropriées pour actions non autorisées

### 5. Synchronisation
- [ ] Modifications de l'admin apparaissent chez les membres
- [ ] Délai de synchronisation acceptable (≤5 secondes)
- [ ] Pas de conflits de données

## 🧪 Scénarios de Test

### Test 1 : Inscription et Création de Kanban

**Étapes :**
1. Ouvrir l'application
2. Aller sur l'onglet "Créer un Kanban"
3. Remplir :
   - Nom : "Marie Dupont"
   - Email : "marie@test.com"
   - Mot de passe : "test123"
   - Titre : "Test Kanban ISJ"
4. Cliquer sur "Créer mon Kanban"

**Résultat attendu :**
- ✅ Compte créé
- ✅ Kanban créé avec code d'invitation (ex: KAN-XYZ789)
- ✅ Redirection vers le modal d'invitation
- ✅ Tâche et objectif de démo présents

### Test 2 : Connexion avec Compte Existant

**Étapes :**
1. Se déconnecter
2. Aller sur l'onglet "Se connecter"
3. Entrer email : "marie@test.com"
4. Entrer mot de passe : "test123"
5. Cliquer sur "Se connecter"

**Résultat attendu :**
- ✅ Connexion réussie
- ✅ Redirection vers le Kanban
- ✅ Données persistées sont affichées

### Test 3 : Création d'Objectif et Tâche

**Étapes :**
1. En tant qu'admin, cliquer sur "+" dans Objectifs Principaux
2. Créer un objectif "Logistique Événement"
3. Créer une tâche pour cet objectif
4. Vérifier que l'objectif et la tâche apparaissent

**Résultat attendu :**
- ✅ Objectif créé et visible
- ✅ Tâche créée et visible dans "Tâches"
- ✅ Toast de succès affiché
- ✅ Données sauvegardées (vérifier après refresh)

### Test 4 : Attribution et Changement de Statut

**Étapes :**
1. Créer une tâche
2. L'attribuer à un membre
3. Marquer comme urgente
4. Valider la tâche

**Résultat attendu :**
- ✅ Tâche passe dans "En cours" après attribution
- ✅ Tâche passe dans "Urgent" après marquage
- ✅ Tâche passe dans "Vérification" puis "Complet"
- ✅ Timestamps mis à jour correctement

### Test 5 : Invitation de Membre

**Étapes :**
1. Noter le code d'invitation du Kanban
2. Ouvrir une fenêtre de navigation privée
3. Créer un compte : jean@test.com
4. Utiliser le lien d'invitation ou entrer le code
5. Vérifier l'accès en lecture seule

**Résultat attendu :**
- ✅ Membre peut rejoindre avec le code
- ✅ Membre voit tous les objectifs et tâches
- ✅ Membre ne peut PAS créer/modifier/supprimer
- ✅ Boutons de modification désactivés ou cachés

### Test 6 : Synchronisation Temps Réel

**Étapes :**
1. Ouvrir le Kanban en tant qu'admin (fenêtre 1)
2. Ouvrir le Kanban en tant que membre (fenêtre 2)
3. En tant qu'admin, créer une nouvelle tâche
4. Attendre maximum 5 secondes
5. Vérifier que le membre voit la nouvelle tâche

**Résultat attendu :**
- ✅ Nouvelle tâche apparaît chez le membre en ≤5 secondes
- ✅ Pas de doublon
- ✅ Toutes les données correctes

### Test 7 : Persistance Après Refresh

**Étapes :**
1. Créer plusieurs objectifs et tâches
2. Rafraîchir la page (F5)
3. Vérifier que tout est encore là

**Résultat attendu :**
- ✅ Session maintenue
- ✅ Kanban chargé automatiquement
- ✅ Toutes les données présentes
- ✅ Statuts préservés

## 🐛 Erreurs Courantes et Solutions

### Erreur : "Failed to fetch"
**Cause :** Serveur backend non accessible
**Solution :** 
- Vérifier que Supabase est connecté
- Vérifier la connexion internet
- Regarder les logs du serveur

### Erreur : "Unauthorized"
**Cause :** Session expirée ou token invalide
**Solution :**
- Se déconnecter et se reconnecter
- Vider le localStorage et réessayer

### Erreur : "Invalid invite code"
**Cause :** Code d'invitation incorrect ou expiré
**Solution :**
- Vérifier le code (sensible à la casse)
- Demander un nouveau code au propriétaire

### Erreur : "Only admins can..."
**Cause :** Tentative de modification en tant que membre
**Solution :**
- Normal si vous êtes membre
- Demander au propriétaire de faire la modification

## 📊 Métriques de Performance

### Temps de Réponse Cibles
- Authentification : < 2 secondes
- Création de Kanban : < 3 secondes
- Création d'objectif/tâche : < 1 seconde
- Modification de tâche : < 1 seconde
- Synchronisation : ≤ 5 secondes

### Capacité
- Objectifs par Kanban : Illimité (recommandé < 50)
- Tâches par Kanban : Illimité (recommandé < 200)
- Membres par Kanban : Illimité (recommandé < 20)
- Kanbans par utilisateur : Illimité

## 🎯 Validation Finale

Avant de considérer l'intégration complète :

- [ ] Tous les tests passent
- [ ] Aucune erreur dans la console
- [ ] Performance acceptable
- [ ] UX fluide et réactive
- [ ] Messages d'erreur clairs
- [ ] Design préservé
- [ ] Animations fonctionnent
- [ ] Responsive sur mobile/desktop

## 📝 Notes de Développement

### Technologies Utilisées
- **Frontend** : React, TypeScript, Tailwind CSS, Motion/React
- **Backend** : Supabase Edge Functions (Deno/Hono)
- **Base de Données** : Supabase KV Store
- **Authentification** : Supabase Auth
- **Synchronisation** : Polling (5 secondes)

### Architecture
```
Frontend (React)
    ↓
API Client (/src/utils/api.ts)
    ↓
Backend Server (/supabase/functions/server/index.tsx)
    ↓
Supabase Auth + KV Store
```

### Flux de Données
```
1. User Action → 
2. API Call → 
3. Server Validation → 
4. Database Update → 
5. Response to Frontend → 
6. UI Update → 
7. Real-time Sync (polling)
```

---

**Tests réalisés le : [Date]**
**Testeur : [Nom]**
**Statut : ⏳ En cours / ✅ Validé / ❌ Échec**
