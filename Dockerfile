FROM node:22-alpine

WORKDIR /app

# Install runtime deps (tsx is a dependency so we can run the TS directly).
COPY package.json ./
RUN npm install --omit=dev --no-audit --no-fund

# App source
COPY tsconfig.json ./
COPY src ./src
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

ENV NODE_ENV=production
ENV PORT=8787
ENV DATA_DIR=/data/content
ENV UPLOADS_DIR=/data/uploads

EXPOSE 8787

# Persisted content + uploaded images live here (mount a volume).
VOLUME ["/data"]

ENTRYPOINT ["./docker-entrypoint.sh"]
