FROM node:22-alpine AS base
WORKDIR /app

# stage 1
FROM base AS dev
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

#stage 2
FROM dev AS runtime
COPY --from=dev /app/node_modules ./node_modules
COPY  . .
USER node
EXPOSE 3000
CMD ["node", "server.js"]



