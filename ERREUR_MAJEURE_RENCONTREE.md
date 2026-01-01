# Erreur Majeure Rencontrée : 401 Unauthorized via API Gateway

## Résumé

Lors des tests d'authentification JWT via l'API Gateway (port 8080), toutes les requêtes protégées retournaient **401 Unauthorized**, bien que le token JWT soit valide et que la requête directe au microservice (port 8081 pour BookService) fonctionnait parfaitement.

---

## Cause Racine

### Le Problème Technique

L'API Gateway était configurée avec **deux mécanismes d'authentification en conflit** :

1. **Spring Security par défaut** (`.anyExchange().authenticated()`) :

   - Demandait une authentification pour TOUTES les requêtes
   - Rejetait les requêtes **AVANT** que les GlobalFilters custom ne puissent s'exécuter complètement
   - Renvoyait un header `WWW-Authenticate: Basic realm="Realm"` (déclenchant le challenge HTTP Basic 401)

2. **AuthenticationFilter custom** (GlobalFilter) :
   - S'exécutait après Spring Security
   - Validait le token JWT et créait un contexte de sécurité
   - Mais arrivait **trop tard** — le 401 était déjà envoyé par Spring Security

### Architecture Problématique (AVANT)

```
Requête Entrante
        ↓
Spring Security Chain
  ├─ Vérifie .authenticated()
  ├─ Pas de token HTTP Basic → REJECT (401)
  └─ Envoie réponse avant que les filtres globals n'aient le temps de créer l'auth
        ↓
(GlobalFilters never executed for this request)
```

---

## Solution Appliquée

### Modification 1 : `SecurityConfig.java`

**Avant** :

```java
.authorizeExchange(auth -> auth
    .pathMatchers("/api/users/register", "/api/users/login", "/eureka/**", "/actuator/**")
    .permitAll()
    .anyExchange().authenticated()) // ← PROBLÈME : force l'auth Spring par défaut
```

**Après** :

```java
.authorizeExchange(auth -> auth
    .anyExchange().permitAll()) // ← Laisse les filtres custom gérer l'authentification
```

**Explication** : On désactive complètement l'authentification Spring Security par défaut et on confie **entièrement** la sécurité aux GlobalFilters custom (AuthenticationFilter, RoleAuthorizationFilter).

### Modification 2 : Ordre des GlobalFilters

**Ordre établi** :

```
-200: CorrelationIdFilter (ajoute X-Correlation-ID)
-100: AuthenticationFilter (valide JWT, crée contexte d'authentification)
 -50: RateLimitingFilter (limite les requêtes)
   0: RoleAuthorizationFilter (vérifie les rôles RBAC)
```

### Architecture Corrigée (APRÈS)

```
Requête Entrante
        ↓
Spring Security (désactivée pour l'authentification)
        ↓
CorrelationIdFilter (-200) → Ajoute X-Correlation-ID
        ↓
AuthenticationFilter (-100) → Valide JWT, crée l'authentification
        ↓
RateLimitingFilter (-50) → Limite les requêtes
        ↓
RoleAuthorizationFilter (0) → Vérifie les rôles (RBAC)
        ↓
Route vers le microservice cible
```

---

## Logs de Débogage Ajoutés

Pour permettre le traçage du flux, des logs exhaustifs ont été ajoutés :

### AuthenticationFilter

```java
log.info("=== AuthenticationFilter START === Path: {}, Method: {}", path, method);
log.debug("Route isSecured: {}", isSecured);
log.debug("Validating token (prefix): {}...", tokenPrefix);
log.debug("Token valid for user='{}', role='{}'", username, role);
log.warn("Token validation failed (invalid token)");
log.error("JWT validation error in AuthenticationFilter: {}", e.getMessage());
```

### RouteValidator

```java
log.debug("RouteValidator: path='{}', matchesPublic={}, isSecured={}", path, matchesPublic, isSecured);
```

---

## Ce Qui Bloquait Avant (Détails Techniques)

### 1. Conflit entre Spring Security et GlobalFilters

- **Spring Security** fonctionne au niveau du `DispatcherHandler` réactif
- **GlobalFilters** s'exécutent au niveau du `GatewayFilterChain`
- L'ordre d'exécution n'était pas garanti : Spring Security pouvait rejeter avant les filtres

### 2. Pas de Propagation du Contexte de Sécurité

Même si `AuthenticationFilter` créait un `UsernamePasswordAuthenticationToken`, Spring Security ne le voyait pas car :

- Il vérifiait déjà la requête AVANT
- Le contexte réactif (`ReactiveSecurityContextHolder`) n'était pas accessible aux filtres Spring Security qui s'exécutaient en parallèle

### 3. Header `WWW-Authenticate` : Basic Realm

Spring Security, en l'absence de token Basic/Form, retournait :

```
HTTP/1.1 401 UNAUTHORIZED
WWW-Authenticate: Basic realm="Realm"
```

Cela bloquer toute requête avec Bearer token JWT.

---

## Est-ce une Bonne Pratique ?

### Réponse Courte : **OUI, mais avec réserves**

### Analyse Détaillée

#### ✅ Bonnes Pratiques Respectées

1. **Séparation des Préoccupations**

   - Spring Security n'a plus à gérer l'authentification JWT au niveau du Gateway
   - AuthenticationFilter est responsable de la validation JWT
   - RoleAuthorizationFilter gère l'autorisation RBAC
   - Chaque composant a une responsabilité unique

2. **Pattern Gateway Authentification**

   - C'est l'approche recommandée pour les API Gateways dans Spring Cloud
   - La doc Spring Cloud Gateway suggère de désactiver Spring Security si vous utilisez des filtres custom

3. **Ordre Explicite des Filtres**

   - Définir l'ordre avec `.getOrder()` rend le flux prévisible et maintenable
   - Chaque filtre a une responsabilité claire et un ordre défini

4. **Logs de Traçage**
   - Les logs DEBUG/INFO permettent de suivre le flux complet
   - Facilite le debugging et la maintenance

#### ⚠️ Considérations / Pièges Potentiels

1. **Perte de Protection Spring Security**

   - Spring Security fournit des protections supplémentaires (CSRF, XSS, etc.)
   - Vous en êtes maintenant responsable dans vos filtres
   - **Solution** : Garder les désactivations de CSRF/Basic/FormLogin, mais ajouter d'autres protections si nécessaire

2. **Pas de Déclaration Centralisée des Routes Sécurisées**

   - Avant : `pathMatchers("/api/users/login", ...).permitAll()`
   - Après : Cette logique est dans `RouteValidator.openApiEndpoints`
   - **Risque** : Deux sources de vérité pour les routes publiques/privées
   - **Solution** : Garder `RouteValidator` à jour et bien documenté

3. **Validation JWT Côté Gateway Uniquement**
   - Le microservice n'a pas accès au contexte de sécurité créé par le Gateway
   - **Solution** : Propager les headers (`Authorization`, `X-User-Id`, `X-User-Role`) vers le microservice

---

## Recommandations Pour le Futur

### 1. Propager les En-têtes Vers les Microservices

Ajouter dans `AuthenticationFilter` :

```java
exchange.getRequest().mutate()
    .header("X-User-Id", userId)
    .header("X-User-Role", role)
    .header("X-User-Email", username)
    .build();
```

Ainsi, les microservices peuvent vérifier les droits localement si nécessaire.

### 2. Centraliser la Gestion des Routes Publiques/Privées

Considérer une configuration centralisée :

```yaml
gateway:
  public-routes:
    - /api/users/register
    - /api/users/login
    - /eureka/**
```

### 3. Ajouter des Tests d'Intégration

Tester le flux complet :

- Token valide + requête protégée → 200/201
- Token invalide + requête protégée → 401
- USER + POST /api/books → 403 (Forbidden)
- ADMIN + POST /api/books → 201 (Created)

### 4. Monitoring et Alertes

- Alerter sur les 401/403 anormaux
- Monitorer les tokens expirés
- Tracer les tentatives d'accès non autorisé

---

## Résumé des Changements

| Fichier                     | Changement                                                 | Impact                                                            |
| --------------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------- |
| `SecurityConfig.java`       | `.anyExchange().permitAll()` au lieu de `.authenticated()` | Désactive l'auth Spring Security automatique                      |
| `AuthenticationFilter.java` | Ajout de logs detaillés, order = -100                      | Permet de tracer et garantit l'exécution avant les autres filtres |
| `CorrelationIdFilter.java`  | Order = -200 au lieu de -100                               | Exécution en premier pour ajouter le Correlation ID               |
| `RouteValidator.java`       | Ajout de logs de débogage                                  | Traçabilité de la décision public/private                         |

---

## Conclusion

La correction appliquée est **une bonne pratique pour les API Gateways** utilisant Spring Cloud Gateway avec authentification JWT custom. Elle suit le pattern recommandé par Spring et rend le flux d'authentification explicite et traçable.

Le problème venait d'une **configuration incohérente** où Spring Security tentait de gérer l'authentification au moment même où les filtres custom essayaient de le faire. En donnant la responsabilité entièrement aux filtres custom et en laissant Spring Security actif (mais désarmé), on crée une architecture claire et maintenable.
