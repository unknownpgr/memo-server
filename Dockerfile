# Frontend build

FROM node:18-alpine as front-build

WORKDIR /app
COPY frontend/package.json frontend/yarn.lock ./
RUN yarn install --frozen-lockfile
COPY frontend/. .
RUN yarn build

# Backend build

FROM node:18-alpine as back-build

WORKDIR /app
COPY backend/package.json backend/yarn.lock ./
RUN yarn install --frozen-lockfile
COPY backend/. .
RUN yarn build

# Backend production

FROM node:18-alpine

WORKDIR /app
COPY backend/package.json backend/yarn.lock ./
RUN yarn install --frozen-lockfile --production
COPY --from=back-build /app/dist ./dist
COPY --from=front-build /app/dist ./public

# Configure environment
RUN mkdir /db
CMD ["yarn", "start"]