FROM node:10 as builder
WORKDIR /app

# Install dependencies
COPY ./package.json ./yarn.lock ./
RUN yarn install

# Build
COPY ./tsconfig.json ./vue.config.js ./postcss.config.js ./babel.config.js ./
COPY ./public ./public
COPY ./src ./src
RUN yarn run build

FROM nginx:1.17-alpine
COPY --from=builder /app/dist /usr/share/nginx/html