FROM node:20-slim AS base
ENV NODE_ENV=production
ENV PORT=3001
ENV DATABASE_POOL_MIN=0
ENV DATABASE_POOL_MAX=5
WORKDIR /app
RUN chown -R node:node /app
RUN chmod 755 /app
USER node
COPY --chown=node:node package*.json .
COPY --chown=node:node tsconfig*.json .
RUN npm ci && npm cache clean --force && npm install typescript

FROM base AS dev
COPY ./src /app/src
ENV NODE_ENV=development
ENV PATH /app/node_modules/.bin:${PATH}
RUN npm install -D
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "db:migrateAndStart"]

FROM base AS source
COPY ./src /app/src/

FROM source as test
ENV NODE_ENV=development
ENV PATH /app/node_modules/.bin:${PATH}
COPY --from=dev /app/node_modules /app/node_modules
COPY ./.eslintrc.js /app/.eslintrc.js
COPY ./tests/ /app/tests/
RUN eslint .
RUN jest
CMD ["echo", "tests succeed!"]

FROM source AS prod
CMD ["node", "dist/src/api/app.js"]