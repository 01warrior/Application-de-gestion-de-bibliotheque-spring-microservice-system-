# Plan d'Implémentation - Système de Gestion de Bibliothèque

## Structure du Projet

Le projet sera organisé en modules Maven séparés pour chaque microservice :
```
bibliotheque-microservices/
├── eureka-server/
├── api-gateway/
├── book-service/
├── user-service/
├── loan-service/
└── common/
```

## Tâches d'Implémentation

✅ **Déjà créé avec IntelliJ :** ApiGateway, EurekaServer, BookService, UserService avec structures de base

- [x] 1. Finaliser la configuration de l'infrastructure existante
  - Compléter la configuration du serveur Eureka existant
  - Finaliser la configuration de l'API Gateway existant
  - Créer le service EmpruntsService manquant
  - _Exigences: 5.1, 5.2, 5.3_

- [x] 1.1 Finaliser le serveur Eureka existant


  - Ajouter les annotations @EnableEurekaServer à EurekaServerApplication
  - Configurer application.yml pour Eureka Server (port 8761)
  - Tester le démarrage du serveur Eureka
  - _Exigences: 5.1, 5.2_

- [x] 1.2 Finaliser l'API Gateway existant


  - Ajouter les annotations @EnableEurekaClient à ApiGatewayApplication
  - Configurer les routes vers les microservices dans application.yml
  - Ajouter les dépendances JWT manquantes au pom.xml
  - _Exigences: 4.1, 4.2_

- [x] 1.3 Créer le service EmpruntsService manquant
  - Créer la structure Spring Boot complète pour EmpruntsService
  - Configurer le pom.xml avec les dépendances nécessaires
  - Créer la classe principale EmpruntsServiceApplication
  - _Exigences: 3.1, 3.2_

- [x] 2. Finaliser le Service Utilisateurs existant
  - Ajouter les dépendances JWT et sécurité manquantes
  - Implémenter les entités, repositories, services et contrôleurs
  - Configurer Spring Security avec JWT
  - _Exigences: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 2.1 Ajouter les dépendances manquantes au UserService


  - Ajouter Spring Security et JWT au pom.xml existant
  - Ajouter les dépendances de validation et BCrypt
  - Ajouter jqwik pour les tests basés sur les propriétés
  - _Exigences: 2.4, 6.1, 6.5_

- [x] 2.2 Créer l'entité Utilisateur et le repository


  - Implémenter la classe Utilisateur avec validations JPA dans le projet existant
  - Créer UtilisateurRepository avec méthodes de recherche
  - Configurer la base de données MySQL dans application.yml
  - _Exigences: 2.1, 2.5_

- [ ]* 2.3 Écrire le test de propriété pour la création d'utilisateurs
  - **Propriété 6: Création complète des utilisateurs**
  - **Valide: Exigences 2.1**

- [x] 2.4 Implémenter le service d'authentification et JWT


  - Créer AuthService avec méthodes login/register dans le projet existant
  - Implémenter JwtUtil pour génération et validation des tokens
  - Configurer Spring Security avec JWT
  - _Exigences: 2.4, 6.1, 6.2_

- [ ]* 2.5 Écrire le test de propriété pour la génération JWT
  - **Propriété 9: Génération JWT valide**
  - **Valide: Exigences 2.4**

- [ ]* 2.6 Écrire le test de propriété pour l'expiration JWT
  - **Propriété 19: Expiration JWT**
  - **Valide: Exigences 6.1**

- [x] 2.7 Implémenter le contrôleur utilisateur



  - Créer UtilisateurController avec endpoints REST dans le projet existant
  - Implémenter la validation des données d'entrée
  - Ajouter la gestion d'erreurs globale
  - _Exigences: 2.1, 2.2, 2.3_

- [ ]* 2.8 Écrire le test de propriété pour la validation email
  - **Propriété 10: Validation email et unicité**
  - **Valide: Exigences 2.5**

- [ ]* 2.9 Écrire le test de propriété pour le hachage des mots de passe
  - **Propriété 22: Hachage des mots de passe**
  - **Valide: Exigences 6.5**

- [x] 3. Finaliser le Service Livres existant
  - Ajouter les dépendances manquantes pour les tests
  - Implémenter les entités, repositories, services et contrôleurs
  - Configurer la validation des données et l'audit
  - _Exigences: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 3.1 Ajouter les dépendances manquantes au BookService


  - Ajouter jqwik pour les tests basés sur les propriétés au pom.xml existant
  - Ajouter les dépendances de validation
  - Configurer Hibernate Envers pour l'audit des modifications
  - _Exigences: 1.2, 1.5_

- [x] 3.2 Créer l'entité Livre et le repository
  - Implémenter la classe Livre avec validations (ISBN, etc.) dans le projet existant
  - Créer LivreRepository avec méthodes de recherche
  - Configurer l'audit des modifications (historique) avec Envers
  - _Exigences: 1.1, 1.2, 1.5_

- [ ]* 3.3 Écrire le test de propriété pour la création de livres
  - **Propriété 1: Création complète des livres**
  - **Valide: Exigences 1.1**

- [ ]* 3.4 Écrire le test de propriété pour la validation ISBN
  - **Propriété 5: Validation ISBN**
  - **Valide: Exigences 1.5**

- [x] 3.5 Implémenter le service de gestion des livres
  - Créer LivreService avec logique métier dans le projet existant
  - Implémenter la recherche par titre/auteur
  - Ajouter la vérification des emprunts avant suppression (communication avec EmpruntsService)
  - _Exigences: 1.2, 1.3, 1.4_

- [ ]* 3.6 Écrire le test de propriété pour la recherche de livres
  - **Propriété 3: Recherche exhaustive**
  - **Valide: Exigences 1.3**

- [ ]* 3.7 Écrire le test de propriété pour la protection contre suppression
  - **Propriété 4: Protection contre suppression**
  - **Valide: Exigences 1.4**

- [x] 3.8 Implémenter le contrôleur des livres
  - Créer LivreController avec tous les endpoints REST dans le projet existant
  - Ajouter la validation des données d'entrée
  - Implémenter la gestion d'erreurs spécifique
  - _Exigences: 1.1, 1.2, 1.3, 1.4_

- [ ] 4. Checkpoint - Vérifier que tous les tests passent
  - S'assurer que tous les tests passent, demander à l'utilisateur si des questions se posent.

- [x] 5. Créer et implémenter le Service Emprunts
  - Créer la structure complète du microservice EmpruntsService
  - Implémenter la logique métier des emprunts
  - Configurer la communication avec les autres services
  - _Exigences: 3.1, 3.2, 3.3, 3.4, 3.5_




- [x] 5.1 Créer la structure complète d'EmpruntsService
  - Créer le pom.xml avec toutes les dépendances nécessaires
  - Créer la classe principale EmpruntsServiceApplication
  - Configurer la structure de packages et application.yml
  - _Exigences: 3.1, 3.2_

- [x] 5.2 Créer l'entité Emprunt et le repository
  - Implémenter la classe Emprunt avec statuts
  - Créer EmpruntRepository avec requêtes personnalisées
  - Configurer les relations avec User et Book services via Feign Client
  - _Exigences: 3.1, 3.2_

- [ ]* 5.3 Écrire le test de propriété pour la création d'emprunts
  - **Propriété 11: Création complète des emprunts**
  - **Valide: Exigences 3.1**

- [x] 5.4 Implémenter le service de gestion des emprunts
  - Créer EmpruntService avec logique métier
  - Implémenter la vérification de disponibilité des livres via Feign Client
  - Ajouter le calcul automatique des dates de retour
  - _Exigences: 3.3, 3.4, 3.5_

- [ ]* 5.5 Écrire le test de propriété pour le calcul de période
  - **Propriété 13: Calcul de période d'emprunt**
  - **Valide: Exigences 3.3**

- [ ]* 5.6 Écrire le test de propriété pour le rejet des emprunts indisponibles
  - **Propriété 14: Rejet des emprunts indisponibles**
  - **Valide: Exigences 3.4**

- [ ]* 5.7 Écrire le test de propriété pour la détection des retards
  - **Propriété 15: Détection des retards**
  - **Valide: Exigences 3.5**

- [x] 5.8 Implémenter le contrôleur des emprunts
  - Créer EmpruntController avec endpoints REST
  - Ajouter la validation des données d'emprunt
  - Implémenter la logique de retour de livres
  - _Exigences: 3.1, 3.2_

- [ ]* 5.9 Écrire le test de propriété pour la mise à jour du retour
  - **Propriété 12: Mise à jour du retour**
  - **Valide: Exigences 3.2**

- [ ] 6. Configuration de la sécurité JWT dans l'API Gateway existant
  - Ajouter les dépendances JWT manquantes
  - Implémenter les filtres de sécurité JWT
  - Configurer l'autorisation basée sur les rôles et la limitation de débit
  - _Exigences: 4.2, 4.4, 4.5, 6.2, 6.4_

- [x] 6.1 Ajouter les dépendances JWT à l'API Gateway
  - Ajouter les dépendances JWT au pom.xml existant de l'ApiGateway
  - Ajouter Spring Security pour les filtres
  - Configurer les dépendances pour rate limiting
  - _Exigences: 4.2, 4.5_

- [x] 6.2 Créer les filtres JWT pour l'API Gateway
  - Implémenter JwtAuthenticationFilter dans le projet ApiGateway existant
  - Ajouter la validation des tokens dans les requêtes
  - Configurer l'extraction des informations utilisateur
  - _Exigences: 4.2, 6.2_

- [ ]* 6.3 Écrire le test de propriété pour la validation JWT
  - **Propriété 16: Validation JWT**
  - **Valide: Exigences 4.2**

- [ ]* 6.4 Écrire le test de propriété pour le rejet des tokens expirés
  - **Propriété 20: Rejet des tokens expirés**
  - **Valide: Exigences 6.2**

- [x] 6.5 Implémenter l'autorisation basée sur les rôles
  - Créer RoleAuthorizationFilter dans l'ApiGateway existant
  - Configurer les permissions par endpoint
  - Ajouter la vérification des rôles dans les tokens
  - _Exigences: 6.4_

- [ ]* 6.6 Écrire le test de propriété pour l'autorisation par rôles
  - **Propriété 21: Autorisation basée sur les rôles**
  - **Valide: Exigences 6.4**

- [x] 6.7 Configurer la limitation de débit et les headers de corrélation
  - Implémenter RateLimitingFilter dans l'ApiGateway existant
  - Ajouter CorrelationIdFilter pour le traçage
  - Configurer les limites par utilisateur
  - _Exigences: 4.4, 4.5_

- [ ]* 6.8 Écrire le test de propriété pour les headers de corrélation
  - **Propriété 17: Headers de corrélation**
  - **Valide: Exigences 4.4**

- [ ]* 6.9 Écrire le test de propriété pour la limitation de débit
  - **Propriété 18: Limitation de débit**
  - **Valide: Exigences 4.5**

- [ ] 7. Configuration du monitoring et logging
  - Configurer Spring Boot Actuator sur tous les services
  - Implémenter le logging structuré avec corrélation
  - Ajouter les endpoints de santé personnalisés
  - _Exigences: 7.1, 7.2, 7.3, 7.4_

- [ ] 7.1 Configurer Spring Boot Actuator
  - Ajouter les dépendances Actuator à tous les services
  - Configurer les endpoints de santé et métriques
  - Sécuriser les endpoints de management
  - _Exigences: 7.1, 7.4_

- [ ] 7.2 Implémenter le logging structuré
  - Configurer Logback avec format JSON
  - Ajouter les MDC pour corrélation des logs
  - Implémenter les niveaux de log appropriés
  - _Exigences: 7.2, 7.3_

- [ ]* 7.3 Écrire le test de propriété pour le logging des anomalies
  - **Propriété 23: Logging des anomalies**
  - **Valide: Exigences 7.2**

- [ ]* 7.4 Écrire le test de propriété pour le traçage distribué
  - **Propriété 24: Traçage distribué**
  - **Valide: Exigences 7.3**

- [ ] 8. Configuration des profils et déploiement
  - Créer les fichiers de configuration pour différents environnements
  - Configurer Docker Compose pour le développement local
  - Ajouter les scripts de build et déploiement
  - _Exigences: Toutes_

- [ ] 8.1 Créer les configurations d'environnement
  - Configurer application-dev.yml, application-test.yml, application-prod.yml
  - Paramétrer les connexions aux bases de données
  - Configurer les URLs des services pour chaque environnement
  - _Exigences: Toutes_

- [ ] 8.2 Créer Docker Compose pour développement
  - Écrire docker-compose.yml avec tous les services
  - Configurer les bases de données PostgreSQL
  - Ajouter les variables d'environnement nécessaires
  - _Exigences: Toutes_

- [ ] 9. Checkpoint final - Vérifier que tous les tests passent
  - S'assurer que tous les tests passent, demander à l'utilisateur si des questions se posent.