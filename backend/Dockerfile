# Étape de construction
FROM node:18-alpine AS builder

WORKDIR /app

# Installer les dépendances de construction
RUN apk add --no-cache python3 make g++

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer toutes les dépendances (y compris devDependencies)
RUN npm install

# Copier le reste des fichiers
COPY . .

# Étape d'exécution pour le développement
FROM node:18-alpine AS development

WORKDIR /app

# Copier les dépendances installées
COPY --from=builder /app/node_modules ./node_modules

# Copier le code source
COPY . .

# Exposer le port d'écoute
EXPOSE 4000

# Commande par défaut pour le développement
CMD ["npm", "start"]

# Étape d'exécution pour la production
FROM node:18-alpine AS production

WORKDIR /app

# Installer les dépendances de production uniquement
RUN npm ci --only=production

# Copier le code source
COPY . .

# Exposer le port d'écoute
EXPOSE 4000

# Commande de démarrage pour la production
CMD ["npm", "start"]
