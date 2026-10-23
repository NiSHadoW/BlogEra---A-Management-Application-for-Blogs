FROM node:20-alpine AS backend

WORKDIR /app

COPY backend/package*.json ./
RUN npm ci
COPY backend/ ./

EXPOSE 5000

CMD ["npm", "start"]

FROM node:20-alpine AS frontend

WORKDIR /app

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
ARG NEXT_PUBLIC_API_URL=http://localhost:5000/api
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
RUN npm run build

EXPOSE 3000

CMD ["npm", "start", "--", "--hostname", "0.0.0.0"]