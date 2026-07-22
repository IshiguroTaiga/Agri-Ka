# Single Dockerfile for Agri-Ka Farm App on Port 7777
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production Nginx web server on Port 7777
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Configure Nginx to listen on Port 7777
RUN echo 'server { listen 7777; location / { root /usr/share/nginx/html; index index.html; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf

EXPOSE 7777

CMD ["nginx", "-g", "daemon off;"]
