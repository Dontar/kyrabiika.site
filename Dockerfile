FROM node:16-alpine
WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --chown=nextjs:nodejs /next.config.js ./
COPY --chown=nextjs:nodejs /package.json ./
COPY --chown=nextjs:nodejs /package-lock.json ./

COPY --chown=nextjs:nodejs /public ./public
COPY --chown=nextjs:nodejs /next ./next
COPY --chown=nextjs:nodejs /init-db ./init-db

RUN npm ci

USER nextjs

EXPOSE 3000

ENV PORT 3000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
# ENV NEXT_TELEMETRY_DISABLED 1

CMD ["npm", "run start"]
