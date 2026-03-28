# ⚠️ Notes Importantes - Application ISJ Event's Kanban

## 🔐 Sécurité et Confidentialité

### ⚠️ IMPORTANT : Limitation de Figma Make

**Cette application utilise Figma Make pour le prototypage, qui n'est PAS conçu pour :**
- Collecter des données personnellement identifiables (PII) en production
- Sécuriser des données sensibles pour une utilisation professionnelle réelle
- Héberger des applications avec des données critiques

**Pour une utilisation professionnelle réelle :**
1. **Déployez cette application sur votre propre infrastructure**
2. **Configurez votre propre instance Supabase**
3. **Mettez en place des mesures de sécurité appropriées** :
   - SSL/TLS pour toutes les connexions
   - Row Level Security (RLS) sur toutes les tables
   - Rotation régulière des clés API
   - Monitoring et logs d'activité
   - Sauvegardes régulières
   - Tests de sécurité

### 🔑 Gestion des Mots de Passe

- **Minimum 6 caractères** requis (pour Supabase Auth)
- Les mots de passe sont **hachés et stockés de manière sécurisée** par Supabase
- **Ne partagez JAMAIS votre mot de passe**
- Utilisez un mot de passe **unique** pour cette application

### 🌐 Environnement de Développement

Cette application est configurée pour fonctionner dans un environnement de développement/prototypage :
- Les emails ne sont **pas vérifiés** automatiquement (email_confirm: true)
- Pas de serveur SMTP configuré
- Les sessions persistent dans le localStorage du navigateur

## 📊 Structure des Données

### Ce qui est stocké dans Supabase :

1. **Informations Utilisateur**
   - ID utilisateur (UUID)
   - Email
   - Nom complet
   - Metadata (nom d'affichage)

2. **Données Kanban**
   - ID du Kanban
   - Titre du projet
   - Code d'invitation
   - ID et nom du propriétaire
   - Dates de création/modification

3. **Objectifs et Tâches**
   - Titres, descriptions
   - Checklists, ressources
   - Statuts, timestamps
   - Attributions

### Ce qui est stocké dans le navigateur (localStorage) :

- Token d'accès (access_token)
- Informations utilisateur en cache
- Session active

**⚠️ Si vous videz le cache/localStorage, vous serez déconnecté !**

## 🔄 Synchronisation Temps Réel

### Comment ça fonctionne :

L'application utilise un système de **polling** (pas de WebSocket) :
- **Fréquence** : Toutes les 5 secondes
- **Qui** : Seulement les membres non-admin
- **Pourquoi** : Les admins voient leurs modifications instantanément

### Implications :

- ✅ **Avantage** : Simple, fiable, fonctionne partout
- ⚠️ **Inconvénient** : Délai de 0-5 secondes pour voir les changements
- 💡 **Optimisation possible** : Implémenter Supabase Realtime avec WebSocket

## 🎨 Design et Performance

### Animations

L'application utilise Motion/React pour :
- Transitions entre pages
- Effets sur les cartes
- Animations de chargement
- Feedback visuel

**Impact sur les performances :**
- Performances optimales sur desktop moderne
- Peut être plus lent sur mobile ancien
- Possibilité de désactiver les animations si nécessaire

### Responsive Design

L'application est responsive mais optimisée pour :
- ✅ **Desktop** : Expérience complète
- ✅ **Tablette** : Bonne expérience
- ⚠️ **Mobile** : Fonctionnel mais peut nécessiter du scroll

## 📱 Compatibilité Navigateur

### Navigateurs Supportés :

- ✅ Chrome/Edge (recommandé) : Version 90+
- ✅ Firefox : Version 88+
- ✅ Safari : Version 14+
- ⚠️ Internet Explorer : **NON SUPPORTÉ**

### Fonctionnalités Requises :

- JavaScript activé
- LocalStorage activé
- Cookies tiers autorisés (pour Supabase)
- Connexion internet stable

## 🚀 Workflow Recommandé

### Pour le Propriétaire (Admin)

1. **Création du Kanban**
   - Créez un compte avec un email professionnel
   - Nommez clairement votre projet
   - Notez le code d'invitation immédiatement

2. **Configuration Initiale**
   - Créez les objectifs principaux
   - Ajoutez les premières tâches
   - Testez le workflow complet

3. **Invitation des Membres**
   - Partagez le code ou lien d'invitation
   - Expliquez le rôle de consultation uniquement
   - Vérifiez que les membres peuvent accéder

4. **Gestion Quotidienne**
   - Utilisez le Dashboard pour une vue d'ensemble
   - Attribuez les tâches de manière claire
   - Marquez les urgences explicitement
   - Validez régulièrement les tâches terminées

### Pour les Membres

1. **Rejoindre le Kanban**
   - Créez un compte avec votre email professionnel
   - Utilisez le code d'invitation fourni
   - Vérifiez que vous voyez toutes les tâches

2. **Consultation**
   - Consultez le Kanban régulièrement
   - Vérifiez vos tâches attribuées
   - Consultez le Dashboard pour les stats
   - Actualisez si vous ne voyez pas les dernières modifications

3. **Communication**
   - Communiquez avec l'admin pour toute modification
   - Signalez les tâches terminées
   - Demandez des clarifications si nécessaire

## 🔧 Dépannage

### Problème : "Je ne vois pas mes données après refresh"

**Solutions :**
1. Vérifiez votre connexion internet
2. Regardez la console du navigateur (F12)
3. Déconnectez-vous et reconnectez-vous
4. Videz le cache et réessayez

### Problème : "Les modifications de l'admin n'apparaissent pas"

**Solutions :**
1. Attendez 5 secondes (délai de synchronisation)
2. Rafraîchissez manuellement la page (F5)
3. Vérifiez que vous êtes connecté au bon Kanban
4. Vérifiez votre connexion internet

### Problème : "Je ne peux pas modifier les tâches"

**Cause :** Vous êtes un membre, pas un admin

**Solution :** C'est normal ! Seul le propriétaire peut modifier. Contactez-le pour les changements.

### Problème : "Code d'invitation invalide"

**Solutions :**
1. Vérifiez que le code est correct (sensible à la casse)
2. Vérifiez qu'il n'y a pas d'espace avant/après
3. Demandez un nouveau code au propriétaire
4. Utilisez le lien d'invitation plutôt que le code manuel

## 📈 Limites et Quotas

### Limites Techniques Actuelles :

- **Objectifs** : Pas de limite technique, mais recommandé < 50 pour la performance
- **Tâches** : Pas de limite technique, mais recommandé < 200 pour l'UX
- **Membres** : Pas de limite technique, mais recommandé < 20
- **Checklists** : Recommandé < 10 items par tâche
- **Taille des descriptions** : Recommandé < 500 caractères

### Quotas Supabase (Plan Gratuit) :

- **Base de données** : 500 MB
- **Stockage** : 1 GB
- **Requêtes** : Illimitées
- **Utilisateurs actifs** : 50,000 MAU (Monthly Active Users)

**💡 Pour des besoins plus importants, envisagez un plan Supabase payant**

## 🎯 Meilleures Pratiques

### Gestion des Tâches

1. **Soyez Précis** : Titres et descriptions clairs
2. **Utilisez les Checklists** : Découpez les grandes tâches
3. **Estimations Réalistes** : Heures estimées précises
4. **Statuts Clairs** : Utilisez correctement le workflow
5. **Urgences Justifiées** : Ne pas abuser du statut "Urgent"

### Organisation

1. **Objectifs SMART** : Spécifiques, Mesurables, Atteignables, Réalistes, Temporels
2. **Revues Régulières** : Consultez le Dashboard hebdomadairement
3. **Communication** : Commentez et documentez les décisions
4. **Archivage** : Supprimez ou marquez les tâches obsolètes

### Sécurité

1. **Mots de passe forts** : Minimum 12 caractères avec variété
2. **Pas de partage** : Chaque personne a son propre compte
3. **Déconnexion** : Sur ordinateurs partagés
4. **Vérification** : Validez les invitations avant de partager

## 📞 Support et Ressources

### Documentation

- **Guide Utilisateur** : `/GUIDE_UTILISATEUR.md`
- **Guide Backend** : `/GUIDE_BACKEND.md`
- **Tests d'Intégration** : `/TEST_INTEGRATION.md`

### Ressources Externes

- **Supabase** : https://supabase.com/docs
- **React** : https://react.dev
- **Motion** : https://motion.dev

### En Cas de Problème

1. Consultez la console navigateur (F12 → Console)
2. Vérifiez votre connexion internet
3. Relisez ce document
4. Contactez votre administrateur système

---

**Dernière mise à jour : Janvier 2026**
**Version de l'application : 2.0.0 (Backend Intégré)**

✨ **Profitez de votre application ISJ Event's Kanban !** ✨
