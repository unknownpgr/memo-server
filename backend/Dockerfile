# Build stage
FROM node:18-alpine as build

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn prisma generate
RUN yarn build

# Production stage
FROM node:18-alpine

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
RUN yarn prisma generate

# Configure environment
ENV DATABASE_URL="file:/db/sqlite"
RUN mkdir /db
RUN touch /db/sqlite
CMD ["yarn", "start"]