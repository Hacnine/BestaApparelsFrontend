# Frontend Dockerfile
FROM node:20
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 8081
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "8081"]
