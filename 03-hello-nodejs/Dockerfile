# ใช้ Node.js official image
FROM node:18-alpine

# กำหนด working directory
WORKDIR /app

# Copy package.json
COPY package.json .

# ติดตั้ง dependencies (ถ้ามี)
RUN npm install --production

# Copy source code
COPY index.js .

# Expose port
EXPOSE 3000

# สั่งรัน application
CMD ["npm", "start"]
