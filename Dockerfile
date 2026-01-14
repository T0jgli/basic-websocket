# Install dependencies only when needed
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm install


FROM node:20-alpine as builder
WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH
RUN addgroup -S nodeapp && adduser -S nodeapp -G nodeapp -u 1001
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN chown -R nodeapp:nodeapp /app
USER 1001
RUN npm run build
EXPOSE 3000
# start app
CMD ["npm", "start"]
