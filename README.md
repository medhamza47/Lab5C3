# Lab 5 — Services et API REST

Démarrer Spring Boot avec Java 17 et Maven depuis `backend/` avec `mvn spring-boot:run`. Puis ouvrir un terminal dans `frontend/`.

Avec Node.js 22 (22.12 ou plus récent sur cette version majeure), exécuter `npm install`, puis `npm start`. Ouvrir http://localhost:4200.

## Architecture

Angular appelle `StudentService` via HttpClient et consomme les résultats sous forme d’Observables. L’intercepteur convertit les erreurs HTTP en messages compréhensibles. Le proxy Angular redirige l’API vers Spring Boot sur le port 8080, et la configuration CORS permet aussi les appels directs depuis le serveur Angular local.

Spring MVC reçoit les requêtes sous `/api/students`. Les DTO valident les données entrantes. La couche service gère les transactions et délègue la persistance à Spring Data JPA. H2 fournit une base en mémoire initialisée avec un étudiant. Les données reviennent à leur état initial après redémarrage.

| Méthode | URI | Résultat |
| --- | --- | --- |
| GET | `/api/students` | Liste |
| GET | `/api/students/{id}` | Fiche ou 404 |
| POST | `/api/students` | Étudiant créé, 201 |
| PUT | `/api/students/{id}` | Étudiant modifié ou 404 |
| DELETE | `/api/students/{id}` | 204 ou 404 |
