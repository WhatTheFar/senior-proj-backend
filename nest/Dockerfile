FROM node:10 as builder
WORKDIR /app

# Install dependencies
COPY ./package.json ./yarn.lock ./
RUN yarn install

# Build
COPY ./tsconfig.json ./tsconfig.build.json ./
COPY ./src ./src
RUN yarn run build

FROM node:10-alpine
WORKDIR /app

COPY --from=builder /app/package.json /app/yarn.lock ./
COPY --from=builder /app/node_modules ./node_modules

RUN yarn install --production --ignore-scripts --prefer-offline

COPY --from=builder /app/dist ./dist

CMD yarn run start:prod