# 1. fázis: A kód lefordítása (Build)
FROM node:20-alpine AS build
WORKDIR /app

# Függőségek másolása és telepítése
COPY package*.json ./
RUN npm install

# Forráskód másolása és a production build lefuttatása
COPY . .
RUN npm run build --configuration=production

# 2. fázis: A kész fájlok kiszolgálása Nginx-szel
FROM nginx:alpine

# Másolás a build fázisból az Nginx mappájába
# FONTOS: A "times-up" helyett írd be a pontos projektnevedet, ahogy a dist mappában létrejön!
# (Az újabb Angularok gyakran egy 'browser' mappába teszik ezen belül, pl.: dist/times-up/browser)
COPY --from=build /app/dist/Frontend/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
