FROM node:18-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci --legacy-peer-deps

FROM base AS builder
WORKDIR /app

# Define build arguments for environment variables
ARG NEXT_PUBLIC_BACKEND_URL
ARG NEXT_PUBLIC_BASE_URL
ARG COOKIES_SECRET_KEY

# Set environment variables from build args without defaults
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV COOKIES_SECRET_KEY=$COOKIES_SECRET_KEY
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Create .env.local with environment variables for build time
RUN echo "NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL" >> .env.local && \
    echo "NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL" >> .env.local && \
    echo "COOKIES_SECRET_KEY=$COOKIES_SECRET_KEY" >> .env.local

RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# No default values for runtime variables
ENV COOKIES_SECRET_KEY=$COOKIES_SECRET_KEY

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000

ENV PORT=3000

CMD ["npm", "start"]