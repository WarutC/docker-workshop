# ใช้ Node.js official image
FROM node:18-alpine

# ติดตั้ง wget สำหรับ health check
RUN apk add --no-cache wget

# กำหนด working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install --production

# Copy source code
COPY src ./src

# Expose port
EXPOSE 3000

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000

# รัน application
CMD ["npm", "start"]
