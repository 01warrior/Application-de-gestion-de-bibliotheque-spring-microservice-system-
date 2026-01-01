# Document des Exigences - Système de Gestion de Bibliothèque

## Introduction

Le système de gestion de bibliothèque est une application distribuée basée sur une architecture microservices qui permet de gérer les livres, les utilisateurs et les emprunts dans une bibliothèque. Le système utilise Spring Boot, Spring Cloud Gateway, Eureka pour la découverte de services, et JWT pour l'authentification et l'autorisation.

## Glossaire

- **Système_Bibliotheque**: L'ensemble de l'application de gestion de bibliothèque
- **Service_Livres**: Microservice responsable de la gestion des informations sur les livres
- **Service_Utilisateurs**: Microservice responsable de la gestion des utilisateurs inscrits
- **Service_Emprunts**: Microservice responsable de la gestion des emprunts et retours
- **API_Gateway**: Point d'entrée unique pour tous les appels vers les microservices
- **Eureka_Server**: Service de découverte et d'enregistrement des microservices
- **JWT_Token**: Token d'authentification JSON Web Token
- **Livre**: Entité représentant un livre avec ses métadonnées
- **Utilisateur**: Entité représentant un utilisateur inscrit dans le système
- **Emprunt**: Entité représentant une transaction d'emprunt de livre

## Exigences

### Exigence 1

**User Story:** En tant qu'administrateur de bibliothèque, je veux gérer les informations des livres, afin de maintenir un catalogue à jour et accessible.

#### Critères d'Acceptation

1. WHEN un administrateur ajoute un nouveau livre, THEN le Service_Livres SHALL créer une entrée avec id, titre, auteur, catégorie et ISBN
2. WHEN un administrateur modifie les informations d'un livre, THEN le Service_Livres SHALL mettre à jour les données et conserver l'historique des modifications
3. WHEN un utilisateur recherche un livre par titre ou auteur, THEN le Service_Livres SHALL retourner tous les livres correspondants avec leurs informations complètes
4. WHEN un administrateur supprime un livre, THEN le Service_Livres SHALL vérifier qu'aucun emprunt actif n'existe pour ce livre avant la suppression
5. WHEN le Service_Livres reçoit une requête, THEN le système SHALL valider que l'ISBN respecte le format standard international

### Exigence 2

**User Story:** En tant qu'administrateur, je veux gérer les utilisateurs inscrits, afin de contrôler l'accès aux services de la bibliothèque.

#### Critères d'Acceptation

1. WHEN un nouvel utilisateur s'inscrit, THEN le Service_Utilisateurs SHALL créer un compte avec id, nom, email, adresse et téléphone
2. WHEN un utilisateur met à jour ses informations personnelles, THEN le Service_Utilisateurs SHALL valider et sauvegarder les nouvelles données
3. WHEN un administrateur recherche un utilisateur, THEN le Service_Utilisateurs SHALL permettre la recherche par nom ou email
4. WHEN un utilisateur tente de s'authentifier, THEN le Service_Utilisateurs SHALL vérifier les credentials et générer un JWT_Token valide
5. WHEN le Service_Utilisateurs reçoit des données utilisateur, THEN le système SHALL valider le format de l'email et l'unicité de l'adresse email

### Exigence 3

**User Story:** En tant qu'utilisateur inscrit, je veux emprunter et retourner des livres, afin d'accéder aux ressources de la bibliothèque.

#### Critères d'Acceptation

1. WHEN un utilisateur demande l'emprunt d'un livre disponible, THEN le Service_Emprunts SHALL créer un enregistrement avec utilisateur_id, livre_id et date_emprunt
2. WHEN un utilisateur retourne un livre, THEN le Service_Emprunts SHALL mettre à jour l'enregistrement avec la date_retour
3. WHEN le système calcule la date de retour, THEN le Service_Emprunts SHALL définir une période d'emprunt de 14 jours par défaut
4. WHEN un utilisateur tente d'emprunter un livre déjà emprunté, THEN le Service_Emprunts SHALL rejeter la demande et informer de l'indisponibilité
5. WHEN un emprunt dépasse la date de retour prévue, THEN le Service_Emprunts SHALL marquer l'emprunt comme en retard

### Exigence 4

**User Story:** En tant qu'utilisateur du système, je veux accéder aux services via un point d'entrée unique, afin de bénéficier d'une expérience utilisateur cohérente.

#### Critères d'Acceptation

1. WHEN un client envoie une requête à l'API_Gateway, THEN le système SHALL router la requête vers le microservice approprié
2. WHEN l'API_Gateway reçoit une requête, THEN le système SHALL valider le JWT_Token avant de transmettre la requête
3. WHEN un microservice est indisponible, THEN l'API_Gateway SHALL retourner une réponse d'erreur appropriée au client
4. WHEN l'API_Gateway traite une requête, THEN le système SHALL ajouter les headers de corrélation pour le traçage
5. WHEN une requête est routée, THEN l'API_Gateway SHALL appliquer les politiques de limitation de débit par utilisateur

### Exigence 5

**User Story:** En tant qu'administrateur système, je veux que les microservices se découvrent automatiquement, afin de maintenir une architecture flexible et scalable.

#### Critères d'Acceptation

1. WHEN un microservice démarre, THEN le système SHALL s'enregistrer automatiquement auprès d'Eureka_Server
2. WHEN un microservice devient indisponible, THEN Eureka_Server SHALL le retirer du registre de services
3. WHEN l'API_Gateway recherche un service, THEN Eureka_Server SHALL fournir les instances disponibles avec leur état de santé
4. WHEN plusieurs instances d'un même service sont disponibles, THEN Eureka_Server SHALL permettre la répartition de charge
5. WHEN Eureka_Server redémarre, THEN tous les microservices SHALL se réenregistrer automatiquement

### Exigence 6

**User Story:** En tant qu'utilisateur du système, je veux que mes données soient sécurisées, afin de protéger ma vie privée et l'intégrité du système.

#### Critères d'Acceptation

1. WHEN un utilisateur s'authentifie avec succès, THEN le système SHALL générer un JWT_Token avec une durée de validité limitée
2. WHEN un JWT_Token expire, THEN le système SHALL rejeter toute requête utilisant ce token et demander une nouvelle authentification
3. WHEN le système traite des données sensibles, THEN toutes les communications SHALL utiliser HTTPS
4. WHEN un utilisateur accède à des ressources protégées, THEN le système SHALL vérifier les permissions basées sur les rôles dans le JWT_Token
5. WHEN le système stocke des mots de passe, THEN ils SHALL être hachés avec un algorithme sécurisé comme BCrypt

### Exigence 7

**User Story:** En tant qu'administrateur système, je veux surveiller la santé et les performances du système, afin d'assurer une disponibilité optimale.

#### Critères d'Acceptation

1. WHEN un microservice fonctionne normalement, THEN il SHALL exposer un endpoint de santé qui retourne un statut "UP"
2. WHEN le système détecte une anomalie, THEN il SHALL enregistrer les événements dans les logs avec le niveau approprié
3. WHEN une requête traverse le système, THEN chaque composant SHALL ajouter des informations de traçage
4. WHEN les métriques sont collectées, THEN le système SHALL exposer les données via des endpoints Actuator
5. WHEN une erreur critique survient, THEN le système SHALL maintenir la cohérence des données et éviter la corruption