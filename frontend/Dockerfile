# Utiliser une image de base Node.js pour construire l'application
FROM node:20.18.0 AS build

# Définir le répertoire de travail
WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Installer Angular CLI globalement pour s'assurer que la commande `ng` est disponible
RUN npm install -g @angular/cli

# Copier le reste des fichiers du projet
COPY . .

# Exposer le port 4200
EXPOSE 4200

# Démarrer l'application
CMD ["npm", "start"]