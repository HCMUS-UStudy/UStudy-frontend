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

# Set environment variables from build args (with defaults)
ENV NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL:-https://api.ustudy.io.vn}
ENV NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL:-http://localhost:3000}
ENV COOKIES_SECRET_KEY=${COOKIES_SECRET_KEY:-55EGu/ZYyTDY1GxKWPyDfOVM5FtFYqRNcadpy8fAT+w=}
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Create .env.production with environment variables for build time
RUN echo "NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL" >> .env.production && \
    echo "NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL" >> .env.production && \
    echo "COOKIES_SECRET_KEY=$COOKIES_SECRET_KEY" >> .env.production

RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Pass environment variables to runtime (only non-NEXT_PUBLIC ones needed at runtime)
ARG COOKIES_SECRET_KEY
ENV COOKIES_SECRET_KEY=${COOKIES_SECRET_KEY:-55EGu/ZYyTDY1GxKWPyDfOVM5FtFYqRNcadpy8fAT+w=}

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
# Copy env file for runtime env variables
COPY --from=builder /app/.env.production ./.env.production

USER nextjs

EXPOSE 3000

ENV PORT=3000

CMD ["npm", "start"]