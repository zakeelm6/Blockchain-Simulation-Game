# Étape de construction
FROM node:18-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers
COPY . .

# Construire l'application
RUN npm run build

# Étape de développement
FROM node:18-alpine AS development

WORKDIR /app

# Copier les dépendances
COPY --from=builder /app/node_modules ./node_modules

# Copier le code source
COPY . .

# Exposer le port du serveur de développement
EXPOSE 5173

# Démarrer le serveur de développement
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# Étape de production avec Nginx
FROM nginx:alpine AS production

# Copier les fichiers construits depuis l'étape de construction
COPY --from=builder /app/dist /usr/share/nginx/html

# Copier la configuration Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port 80
EXPOSE 80

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
