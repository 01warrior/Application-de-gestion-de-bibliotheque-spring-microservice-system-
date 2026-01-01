# Architecture du Projet Microservices

Ce document explique l’architecture générale du projet, le rôle d’Eureka (Service Registry) et de l’API Gateway, et comment tout s’imbrique pour simplifier la communication entre les différents microservices.

## Objectif général

Simplifier la communication entre client et microservices et gérer dynamiquement la découverte et le routage.

---

## 1. Découverte de services avec Eureka

- **Rôle :** Annuaire central où chaque microservice s'enregistre au démarrage (ID de service, adresse, port).
- **Fonctionnement :** Les services envoient des "heartbeats" pour rester inscrits. Eureka garde la liste des instances disponibles.
- **Avantage :** Permet de localiser automatiquement des services même si leurs adresses/ports changent (scaling, redéploiement).

## 2. API Gateway

- **Rôle :** Point d'entrée unique pour les clients externes. Il reçoit toutes les requêtes et les routent vers les microservices appropriés.
- **Fonctions courantes :** Authentification, routage dynamique (via Eureka), load-balancing, filtrage, agrégation de réponses, gestion des CORS.
- **Pourquoi l'utiliser :** Simplifie le client (une seule adresse) et centralise les préoccupations transversales (sécurité, logs, throttling).

---

## 3. Exemple de flux

- Client GET /books/123 → ApiGateway décide d'envoyer la requête à `BookService` (instance découverte via Eureka).
- Si `BookService` appelle `UserService`, il peut utiliser le discovery client (ou un client HTTP load-balanced) pour résoudre `UserService` via Eureka.

---

## 4. Pourquoi cette architecture ?

- **Sans Eureka :** Il faudrait configurer manuellement les adresses/ports de chaque service partout (déploiements et clients), plus difficile à scaler et à maintenir.
- **Sans Api Gateway :** Chaque client devrait connaître et appeler directement chaque microservice → complexité côté client, duplication des règles transversales (auth, logs), moins de contrôle centralisé.

---

## 5. Organisation du dépôt

- Les dossiers concernés : [ApiGateway](ApiGateway) et [EurekaServer](EurekaServer).
- Ils fournissent l'infrastructure de découverte et le point d'entrée pour les autres services (BookService, UserService, EmpruntsService).

---

## 6. Ordre de démarrage recommandé (Windows)

```bash
cd EurekaServer
mvnw.cmd spring-boot:run

cd ..\BookService
mvnw.cmd spring-boot:run

cd ..\UserService
mvnw.cmd spring-boot:run

cd ..\EmpruntsService
mvnw.cmd spring-boot:run

cd ..\ApiGateway
mvnw.cmd spring-boot:run
```
