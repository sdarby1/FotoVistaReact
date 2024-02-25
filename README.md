# FotoVista

Dies ist ein Fotografie-Blog Projekt

## Installation

Stelle sicher, dass [Node.js](https://nodejs.org/) auf dem Computer installiert ist.

1. Klone das Repository auf deinen lokalen Computer:

  git clone https://github.com/sdarby1/FotoVistaReact


2. Wechsle in das Projektverzeichnis


3. Installiere die Abhängigkeiten:

  npm install

  - npm install react-hook-form
  - npm install -D vitest
  - npm install react-masonry-css
  - npm install react-router-dom


4. Öffne die Datei src/utils/http.ts in Ihrem React-Projekt und ändern Sie die Basis-URL, um sie mit Ihrem Laravel-Backend-Endpunkt zu verbinden. Zum Beispiel:

  const BASE_URL = 'http://localhost:8000/api';


5. Nachdem Sie die Basis-URL geändert haben, speichern Sie die Datei und starten Sie den React-Entwicklungsserver erneut:

  npm start


# Logindaten

### Administrator

- EMail: admin@administration.com
- Passwort: sJi3X23LqQ

### Beispielbenutzer

- EMail: test@test.de
- Passwort: test1234


# Tests

Für die Vitest Tests öffne in deinem Projektverzeichnis das Terminal und gebe den Befel "npm test" ein.