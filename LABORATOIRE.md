# Laboratoire : Architecture Microservices avec Spring Cloud

## Description du Laboratoire

Ce laboratoire présente la mise en œuvre d'une architecture de microservices pour un système de gestion de bibliothèque utilisant les technologies Spring Boot et Spring Cloud. Le projet démontre les concepts avancés de développement d'applications distribuées, incluant la découverte de services, le routage API, la sécurité JWT, et le contrôle d'accès basé sur les rôles (RBAC).

## Objectifs Pédagogiques

- Comprendre l'architecture microservices
- Implémenter la découverte de services avec Eureka
- Configurer un API Gateway avec Spring Cloud Gateway
- Sécuriser les communications avec JWT
- Appliquer le principe RBAC (Role-Based Access Control)
- Gérer les communications inter-services

## Technologies et Concepts Abordés

### Technologies

- **Spring Boot 3.3.5** : Framework de base pour les microservices
- **Spring Cloud 2023.0.3** : Écosystème pour les architectures distribuées
- **Eureka** : Service de découverte automatique
- **Spring Cloud Gateway** : API Gateway et routage intelligent
- **Spring Security** : Authentification et autorisation
- **JWT (JSON Web Tokens)** : Authentification stateless
- **MySQL** : Persistance des données
- **Maven** : Gestion des dépendances

### Concepts Architecturaux

- **Microservices** : Décomposition en services indépendants
- **API Gateway** : Point d'entrée unique
- **Service Discovery** : Enregistrement et découverte dynamique
- **Authentification JWT** : Sécurité sans état
- **RBAC** : Contrôle d'accès basé sur les rôles
- **Rate Limiting** : Protection contre les abus
- **Distributed Tracing** : Traçabilité des requêtes

## Structure du Laboratoire

### Services Implémentés

1. **Eureka Server** (Port 8761)

   - Registre central des services
   - Découverte automatique des instances

2. **API Gateway** (Port 8080)

   - Routage intelligent des requêtes
   - Authentification JWT
   - Autorisation RBAC
   - Rate limiting
   - Correlation ID pour le tracing

3. **User Service** (Port 8082)

   - Gestion des utilisateurs
   - Authentification et génération de tokens
   - Gestion des rôles (USER/ADMIN)

4. **Book Service** (Port 8081)

   - Catalogue de livres
   - CRUD complet des ouvrages
   - Recherche et filtrage

5. **Loan Service** (Port 8083)
   - Gestion des emprunts
   - Suivi des retours
   - Historique des emprunts

## Fonctionnalités Clés

### Sécurité et Authentification

- Routes publiques : `/api/users/register`, `/api/users/login`
- Authentification JWT obligatoire pour les autres routes
- Deux niveaux d'autorisation :
  - **USER** : Accès en lecture, emprunts
  - **ADMIN** : Accès complet (CRUD sur livres et utilisateurs)

### API Gateway Features

- **Routing** : Routage vers les services appropriés
- **Filtrage** : Validation JWT et autorisation
- **Rate Limiting** : Protection contre les attaques DoS
- **Tracing** : Header de corrélation pour le débogage

## Déroulement du Laboratoire

### Phase 1 : Configuration de Base

- Création des microservices Spring Boot
- Configuration Eureka Server
- Mise en place de la communication inter-services

### Phase 2 : API Gateway

- Implémentation du routage
- Configuration des filtres de sécurité
- Tests de base des endpoints

### Phase 3 : Sécurité

- Implémentation JWT
- Configuration RBAC
- Tests d'autorisation

### Phase 4 : Fonctionnalités Avancées

- Rate limiting
- Distributed tracing
- Optimisations et tests finaux

## Tests et Validation

### Tests Fonctionnels

- Authentification et autorisation
- CRUD complet sur les entités
- Communications inter-services
- Gestion des erreurs

### Tests de Sécurité

- Tentatives d'accès non autorisé
- Validation des rôles
- Rate limiting

### Tests de Performance

- Comportement sous charge
- Temps de réponse
- Utilisation des ressources

## Livrables

- Code source complet des 5 microservices
- Configuration Docker (optionnel)
- Tests automatisés
- Documentation technique
- Guide de déploiement

## Compétences Acquises

À l'issue de ce laboratoire, l'étudiant sera capable de :

- Concevoir une architecture microservices
- Implémenter la découverte de services
- Sécuriser une API avec JWT et RBAC
- Configurer un API Gateway
- Déboguer des applications distribuées
- Appliquer les bonnes pratiques DevOps

## Évaluation

- Fonctionnement correct de tous les services
- Sécurité implémentée correctement
- Code de qualité et bien structuré
- Tests couvrant les fonctionnalités critiques
- Documentation claire et complète</content>
  <parameter name="filePath">c:\Users\alltu\Desktop\COURS TROIS ANNEE MUNDIAPOLIS\MICROSERVICES CLOUD\ProjetFinal\LABORATOIRE.md
