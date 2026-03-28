# 📘 Guide Utilisateur Détaillé - ISJ Event's Kanban

## 🎬 Introduction

Bienvenue dans l'application Kanban ISJ Event's ! Ce guide vous accompagne pas à pas pour maîtriser toutes les fonctionnalités.

---

## 👤 Types d'Utilisateurs

### 🔑 Propriétaire / Administrateur
**Pouvoirs** :
- ✅ Créer et modifier des objectifs
- ✅ Créer et modifier des tâches
- ✅ Attribuer des tâches aux membres
- ✅ Marquer des tâches comme urgentes
- ✅ Valider ou redéfinir des tâches
- ✅ Inviter de nouveaux membres
- ✅ Accéder au dashboard complet

**Badge** : `Administrateur` (violet)

### 👥 Membre Invité
**Pouvoirs** :
- 👁️ Consulter le tableau Kanban
- 👁️ Voir toutes les tâches et objectifs
- 👁️ Accéder au dashboard en lecture seule
- ❌ Ne peut PAS modifier

**Badge** : `Mode Consultation` (gris)

---

## 🚀 Démarrage

### 1. Page d'Accueil

Vous arrivez sur une page colorée avec deux onglets :

#### Onglet "Créer un Kanban" (Pour les propriétaires)
```
┌─────────────────────────────────────┐
│  Votre nom complet *                │
│  [Ex: Marie Dupont              ]   │
│                                      │
│  Titre du projet Kanban *           │
│  [Ex: Organisation ISJ Event's] │
│                                      │
│  [✨ Créer mon Kanban]               │
└─────────────────────────────────────┘
```

#### Onglet "Se connecter" (Pour rejoindre)
```
┌─────────────────────────────────────┐
│  Votre nom complet *                │
│  [Ex: Jean Martin               ]   │
│                                      │
│  Code d'accès Kanban *              │
│  [Ex: KAN-ABC123                ]   │
│                                      │
│  [👥 Accéder au Kanban]              │
└─────────────────────────────────────┘
```

### 2. Création de votre Premier Kanban

**Étapes** :
1. Remplissez **Votre nom** : "Sophie Laurent"
2. Donnez un **titre** : "Organisation Concert 2026"
3. Cliquez sur **"Créer mon Kanban"**

**Résultat** :
```
┌────────────────────────────────────────┐
│  ✅ Kanban créé avec succès !         │
│                                         │
│  📋 Projet : Organisation Concert 2026│
│                                         │
│  🔑 Code d'accès                       │
│  ┌─────────────┐                       │
│  │  KAN-XYZ789 │  [📋 Copier]          │
│  └─────────────┘                       │
│                                         │
│  🔗 Lien d'invitation                  │
│  https://...?invite=KAN-XYZ789         │
│  [📋 Copier le lien]                   │
│                                         │
│  [▶️ Commencer à utiliser mon Kanban]  │
└────────────────────────────────────────┘
```

💡 **Astuce** : Copiez immédiatement le code et le lien pour inviter votre équipe !

---

## 🎯 Interface du Tableau Kanban

### En-tête

```
┌────────────────────────────────────────────────────────────┐
│ ✨ Organisation Concert 2026                                │
│ 🏷️ KAN-XYZ789  | 👑 Administrateur | 👥 5 membres          │
│                                                              │
│ [📊 Dashboard] [🔗 Inviter] [+ Objectif] [+ Tâche] [🚪 Déconnexion] │
└────────────────────────────────────────────────────────────┘
```

### Les 7 Colonnes

```
┌──────────┬──────────┬──────────┬──────────┬──────────┬──────────┬──────────┐
│ 🎯       │ 📋       │ ⚡       │ ⚙️       │ ⏱️       │ 👁️       │ ✅       │
│Objectifs │ Tâches   │ Urgent   │ En cours │ Durée    │Vérifica- │ Accompli │
│Principaux│          │          │          │          │tion      │          │
├──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
│          │          │          │          │          │          │          │
│[Post-its]│[Post-its]│[Post-its]│[Post-its]│[Timeline]│[Post-its]│[Post-its]│
│          │          │          │          │          │          │          │
└──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┘
```

---

## 📝 Gestion des Objectifs

### Créer un Objectif

**Bouton** : `+ Objectif` (en-tête, réservé admin)

**Formulaire** :
```
┌─────────────────────────────────────┐
│ Titre de l'objectif *               │
│ [Finaliser les Partenariats     ]   │
│                                      │
│ Description (optionnel)             │
│ [Établir et sécuriser tous les...]  │
│                                      │
│ Couleur d'identification *          │
│ ┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐       │
│ │🔵││🟣││🌸││🔴││🟠││🟡││🟢│       │
│ └──┘└──┘└──┘└──┘└──┘└──┘└──┘       │
│                                      │
│ [Annuler] [Créer l'objectif]        │
└─────────────────────────────────────┘
```

**Résultat** : Un beau post-it coloré apparaît en Colonne 1 !

```
┌────────────────────────────────┐
│ 🟦 Finaliser les Partenariats  │ ← Indicateur couleur
│                                 │
│ Établir et sécuriser tous les   │
│ partenariats stratégiques...    │
└────────────────────────────────┘
```

---

## 📋 Gestion des Tâches

### Créer une Tâche

**Bouton** : `+ Tâche` (en-tête, réservé admin)

**Formulaire (Étape par étape)** :

#### 1️⃣ Objectif Principal
```
Objectif principal * [▼]
┌───────────────────────────────────┐
│ 🟦 Finaliser les Partenariats    │ ← Sélectionner
│ 🟣 Organiser la Communication    │
│ 🌸 Gérer la Logistique           │
└───────────────────────────────────┘
```

#### 2️⃣ Informations de Base
```
Titre de la tâche *
[Contacter les sponsors potentiels        ]

Description *
[Identifier et contacter 20 sponsors pour ]
[l'événement, préparer le dossier...      ]

Durée estimée (heures) *
[12]
```

#### 3️⃣ Critères de Validation
```
Critères de validation          [+ Ajouter]
┌──────────────────────────────────────┐
│ [Créer la liste des sponsors ciblés]│
│ [Préparer le dossier de sponsoring ] │
│ [Envoyer les emails de contact     ] │
│ [Faire le suivi des réponses       ] │
└──────────────────────────────────────┘
```

#### 4️⃣ Ressources
```
Ressources matérielles          [+ Ajouter]
┌──────────────────────────────────────┐
│ [Dossier de sponsoring PDF         ] │
│ [Liste de contacts                 ] │
└──────────────────────────────────────┘

Ressources humaines             [+ Ajouter]
┌──────────────────────────────────────┐
│ [Responsable Partenariats          ] │
│ [Assistant Communication           ] │
└──────────────────────────────────────┘

Ressources financières          [+ Ajouter]
┌──────────────────────────────────────┐
│ [Budget communication: 500€        ] │
└──────────────────────────────────────┘
```

**Résultat** : La tâche apparaît en Colonne 2 "Tâches" !

### Anatomie d'une Carte de Tâche

```
┌─────────────────────────────────────┐ ← Bordure couleur objectif
│ Contacter les sponsors potentiels   │ ← Titre
│                                [🔽]  │ ← Bouton expand
│                                      │
│ Progression              2/4        │
│ ████████░░░░░░░░░░░░░░░░ 50%       │ ← Barre animée
│                                      │
│ Identifier et contacter 20...       │ ← Aperçu description
│                                      │
│ 👤 Jean Martin    ⏱️ 12h            │ ← Assigné + durée
│                                      │
│ [🔵 Attribuer]                       │ ← Action (si admin)
└─────────────────────────────────────┘
```

**Version Expandée** (clic sur 🔽) :

```
┌─────────────────────────────────────┐
│ Contacter les sponsors potentiels   │
│                                [🔼]  │
│                                      │
│ Progression              2/4        │
│ ████████░░░░░░░░░░░░░░░░ 50%       │
│                                      │
│ 👤 Jean Martin    ⏱️ 6h / 12h       │
│                                      │
├─────────────────────────────────────┤
│ Identifier et contacter 20 sponsors │
│ pour l'événement, préparer le...    │
│                                      │
│ Critères de validation              │
│ ☑️ Créer la liste des sponsors     │
│ ☑️ Préparer le dossier              │
│ ☐ Envoyer les emails                │
│ ☐ Faire le suivi                    │
│                                      │
│ Ressources                          │
│ 🔨 Matérielles:                     │
│    Dossier de sponsoring PDF       │
│                                      │
│ 👥 Humaines:                        │
│    Responsable Partenariats        │
│                                      │
│ 💰 Financières:                     │
│    Budget communication: 500€      │
│                                      │
├─────────────────────────────────────┤
│ [⚡ Marquer urgent]                  │
└─────────────────────────────────────┘
```

---

## 🎬 Scénarios d'Utilisation

### Scénario 1 : Tâche Normale (Workflow Complet)

```
📝 JOUR 1 - Création
Admin crée la tâche "Contacter les sponsors"
└─> Colonne 2 "Tâches"

👤 JOUR 2 - Attribution
Admin clique "Attribuer" → Sélectionne "Jean"
└─> Migration automatique → Colonne 4 "En cours"
    ⏱️ Décompte démarre : 0h / 12h

✅ JOUR 3-7 - Travail
Jean coche progressivement :
├─ ☑️ Créer la liste (25%)
├─ ☑️ Préparer le dossier (50%)
├─ ☑️ Envoyer les emails (75%)
└─ ☑️ Faire le suivi (100%)
    └─> Migration automatique → Colonne 6 "Vérification"

👁️ JOUR 8 - Vérification
Admin vérifie le travail
Option A: [Complet] → Colonne 7 "Accompli" ✅
Option B: [Redéfinir] → Scission en 2 tâches

🎉 FIN - Accompli
Tâche verrouillée en Colonne 7
```

### Scénario 2 : Tâche Urgente

```
⚡ Mode Express
Admin marque "Réserver la salle" comme URGENT
└─> Colonne 3 "Urgent" (fond rouge)

Marie travaille en priorité
└─> Clique "Terminer" quand fini
    └─> Colonne 6 "Vérification"

Admin vérifie rapidement
└─> [Complet] → Colonne 7 ✅
```

### Scénario 3 : Redéfinition de Tâche

```
👁️ En Vérification
Admin examine "Créer le plan de communication"
└─> Trouve des points à revoir

[Redéfinir]
┌─────────────────────────────────────┐
│ Partie validée (description)        │
│ [Analyse de cible et calendrier OK] │
│                                      │
│ Nouvelle tâche (points à revoir)    │
│ Titre: [Refaire les visuels       ] │
│ Description: [Adapter au nouveau...] │
│ Durée: [4]h                          │
│ Critères: [Design moderne, etc...  ]│
│                                      │
│ [Annuler] [Redéfinir]                │
└─────────────────────────────────────┘

RÉSULTAT:
├─ Tâche 1 (validée) → Colonne 7 ✅
└─ Tâche 2 (corrections) → Colonne 2 📋
```

---

## 📊 Utilisation du Dashboard

**Accès** : Bouton `📊 Dashboard` (en-tête)

### Vue d'Ensemble

```
┌─────────────────────────────────────────────────────┐
│ Tableau de bord                                      │
│ Statistiques et évolution du projet ISJ Event's     │
│                                [⬅️ Retour au Kanban]  │
├─────────────────────────────────────────────────────┤
│                                                      │
│  🎯 Objectifs    📋 Tâches      ⏱️ Heures    👥 Membres │
│     3               15          120h          5       │
│                     10 (67%)    80h (67%)             │
│                                                      │
├─────────────────────────────────────────────────────┤
│  📋 En attente  ⚙️ En cours  ⚡ Urgent  👁️ Vérif  ✅ OK │
│      5             3           2        1         4   │
│                                                      │
├─────────────────────────────────────────────────────┤
│  Répartition des tâches (Camembert)                │
│          ┌─────────┐                                │
│          │ ████████│ 27% En attente                 │
│          │ ████████│ 20% En cours                   │
│          │ ██████  │ 13% Urgent                     │
│          └─────────┘ 40% Accompli                   │
│                                                      │
├─────────────────────────────────────────────────────┤
│  Progression par objectif (Barres)                 │
│  ┌────────────────────────────────────┐            │
│  │ Partenariats    ████████████░░ 80% │            │
│  │ Communication   ██████░░░░░░░░ 40% │            │
│  │ Logistique      ████████████████ 100% │         │
│  └────────────────────────────────────┘            │
│                                                      │
├─────────────────────────────────────────────────────┤
│  Charge de travail par membre                      │
│  ┌────────────────────────────────────┐            │
│  │ Jean        ████ 4 actives, 6 OK   │            │
│  │ Marie       ██ 2 actives, 3 OK     │            │
│  │ Sophie      ███ 3 actives, 1 OK    │            │
│  └────────────────────────────────────┘            │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### Détails des Objectifs

Scroll vers le bas pour voir :

```
┌─────────────────────────────────────────┐
│ 🟦 Finaliser les Partenariats          │
│                           8/10 tâches   │
│                           96/120h       │
│ ████████████████░░░░░░░░░░ 80%         │
│                                         │
│ 🟣 Organiser la Communication          │
│                           2/5 tâches    │
│                           16/40h        │
│ ████████░░░░░░░░░░░░░░░░░░ 40%         │
└─────────────────────────────────────────┘
```

---

## 🔐 Gestion d'Équipe

### Inviter des Membres (Admin)

**Bouton** : `🔗 Inviter` (en-tête)

**Popup** :
```
┌─────────────────────────────────────┐
│ Inviter des membres                 │
│                                      │
│ ✅ Kanban créé avec succès !        │
│    Organisation Concert 2026        │
│                                      │
│ 🔑 Code d'accès                     │
│ ┌───────────┐                       │
│ │KAN-XYZ789 │  [📋 Copier le code]  │
│ └───────────┘                       │
│                                      │
│ 🔗 Lien d'invitation                │
│ https://app.com?invite=KAN-XYZ789   │
│ [📋 Copier le lien]                 │
│                                      │
│ ℹ️ Comment inviter ?                │
│ 1. Partagez le code ou le lien      │
│ 2. Membres entrent nom et fonction  │
│ 3. Accès au Kanban en consultation  │
│                                      │
│ [▶️ Fermer]                          │
└─────────────────────────────────────┘
```

### Rejoindre via Lien

Quand un membre clique sur le lien partagé :

```
┌─────────────────────────────────────┐
│ Rejoindre le Kanban                 │
│                                      │
│ 📋 Projet : Organisation Concert    │
│     Code : KAN-XYZ789               │
│                                      │
│ Votre nom complet *                 │
│ [Thomas Bernard                 ]   │
│                                      │
│ Votre fonction * [▼]                │
│ ┌─────────────────────────────────┐│
│ │ Coordinateur Communication     ││
│ │ Responsable Partenariats       ││
│ │ Gestionnaire Logistique        ││
│ │ Chargé Marketing              ││ ← Sélectionner
│ │ Designer Graphique             ││
│ │ ...                            ││
│ │ Autre                          ││
│ └─────────────────────────────────┘│
│                                      │
│ [👥 Rejoindre l'équipe]              │
└─────────────────────────────────────┘
```

---

## ⌨️ Raccourcis et Astuces

### Raccourcis Visuels

| Couleur Bordure | Signification |
|-----------------|---------------|
| 🟦 Bleu | Objectif "Partenariats" |
| 🟣 Violet | Objectif "Communication" |
| 🌸 Rose | Objectif "Logistique" |

| Badge | Rôle |
|-------|------|
| 👑 Administrateur | Peut tout modifier |
| 👁️ Mode Consultation | Lecture seule |

### Astuces

💡 **Astuce 1** : Cliquez sur l'icône 🔽 pour déplier les détails d'une tâche

💡 **Astuce 2** : La barre de progression est animée avec un effet de brillance

💡 **Astuce 3** : Les tâches en "Vérification" ont une animation de pulsation

💡 **Astuce 4** : Le code Kanban est affiché en haut à gauche, toujours visible

💡 **Astuce 5** : Hover sur une carte pour voir l'effet d'élévation 3D

---

## ❓ FAQ - Questions Fréquentes

### Q1 : Puis-je créer plusieurs Kanbans ?
**R** : Actuellement, chaque session permet un Kanban. Pour plusieurs projets, créez-les séparément.

### Q2 : Que se passe-t-il si je perds mon code d'accès ?
**R** : Le code est affiché en haut du tableau. Cliquez sur "Inviter" pour le revoir.

### Q3 : Les membres peuvent-ils cocher les checklists ?
**R** : Non, seul l'administrateur peut modifier. Les membres consultent uniquement.

### Q4 : Combien de temps une tâche reste en "Vérification" ?
**R** : Jusqu'à ce que l'admin clique "Complet" ou "Redéfinir".

### Q5 : Puis-je supprimer une tâche ?
**R** : Cette fonction n'est pas encore implémentée. Marquez-la comme "Accomplie" pour l'archiver.

### Q6 : Les données sont-elles sauvegardées ?
**R** : Actuellement, les données sont en mémoire (perdues au refresh). Consultez `PROMPT_AMELIORATION.md` pour ajouter une base de données.

### Q7 : Combien de membres puis-je inviter ?
**R** : Illimité ! Mais pour de meilleures performances, restez sous 20 membres.

### Q8 : Puis-je changer la couleur d'un objectif ?
**R** : Non, la couleur est fixée à la création. Créez un nouvel objectif si besoin.

### Q9 : Le timer s'incrémente-t-il automatiquement ?
**R** : Oui, pour les tâches "En cours" et "Urgent", le temps s'incrémente toutes les minutes.

### Q10 : Puis-je exporter les données ?
**R** : Pas encore, mais c'est prévu dans les évolutions futures.

---

## 🎓 Bonnes Pratiques

### Pour les Administrateurs

✅ **DO** :
- Créez des objectifs clairs et distincts
- Utilisez des couleurs différentes pour chaque objectif
- Rédigez des descriptions détaillées pour les tâches
- Validez rapidement les tâches en vérification
- Invitez tous les membres dès le début

❌ **DON'T** :
- Ne créez pas trop d'objectifs (max 5-7)
- N'oubliez pas d'attribuer les tâches créées
- Ne laissez pas les tâches en vérification trop longtemps
- N'utilisez pas le mode "Urgent" systématiquement

### Pour les Membres

✅ **DO** :
- Consultez régulièrement le tableau
- Vérifiez vos tâches assignées
- Communiquez avec l'admin si une tâche bloque

❌ **DON'T** :
- Ne perdez pas le code d'accès
- N'essayez pas de modifier (c'est désactivé)

---

## 🆘 Support

Besoin d'aide ? Plusieurs options :

1. **Relisez ce guide** 📖
2. **Consultez le README.md** 📄
3. **Vérifiez PROMPT_AMELIORATION.md** pour les évolutions 🚀
4. **Contactez le support** : support@isjevents.com 📧

---

**Bonne gestion de projet avec ISJ Event's Kanban ! 🎉**
