# Build Angular
FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration production

# Nginx
FROM nginx:alpine
COPY --from=build /app/dist/adventure-book-ui/browser /usr/share/nginx/html
# Copia a configuração personalizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
