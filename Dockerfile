# Verwenden des offiziellen Node.js-Basisimages
FROM node:latest

# Arbeitsverzeichnis im Container setzen
WORKDIR /app

# Abhängigkeiten installieren
COPY package.json .
COPY package-lock.json .
RUN npm install

# Quellcode in den Container kopieren
COPY . .

# Port freigeben
EXPOSE 3000

# App starten
CMD ["npm", "start"]


