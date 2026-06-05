# Frontend
FROM node:18-alpine AS frontend
WORKDIR /app
COPY package.json .
RUN npm install
COPY public ./public
COPY src ./src
RUN npm run build

# Server
FROM node:18-alpine
WORKDIR /app
COPY server/package.json .
RUN npm install
COPY server/index.js .
COPY --from=frontend /app/build ./public
ENV NODE_ENV=production
EXPOSE 5000
CMD ["node", "index.js"]
