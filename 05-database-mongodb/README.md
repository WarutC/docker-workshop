# Database Project - API + MongoDB

API ที่เชื่อมต่อกับ MongoDB database โดยใช้ Podman Compose

## โครงสร้าง Project

```
05-database-mongodb/
├── src/
│   └── server.js          # Express API server
├── podman-compose.yml     # Multi-container orchestration
├── Dockerfile             # API image
├── package.json
└── README.md
```

## Architecture

```
┌─────────────┐         ┌─────────────┐
│             │         │             │
│     API     │────────▶│   MongoDB   │
│  (Node.js)  │         │  Database   │
│             │         │             │
└─────────────┘         └─────────────┘
      │                       │
      │                       │
   Port 3000              Port 27017
                              │
                         mongodb_data
                          (Volume)
```

## Services

### 1. MongoDB Database

- **Image**: `mongo:7.0`
- **Port**: 27017
- **Credentials**:
  - Username: `admin`
  - Password: `password123`
  - Database: `workshop`
- **Volumes**:
  - `mongodb_data` - เก็บข้อมูล database
  - `mongodb_config` - เก็บ configuration

### 2. API Application

- **Built from**: Dockerfile
- **Port**: 3000
- **Environment**:
  - `NODE_ENV=production`
  - `MONGODB_URI=mongodb://admin:password123@mongodb:27017/workshop?authSource=admin`

## API Endpoints

- `GET /` - ข้อมูลหลัก
- `GET /health` - Health check (รวม database ping)
- `GET /users` - ดู users ทั้งหมด
- `GET /users/:id` - ดู user ตาม ID
- `POST /users` - สร้าง user ใหม่
- `DELETE /users/:id` - ลบ user
- `GET /stats` - ดูสถิติ database

## ขั้นตอนการรัน

### 1. รัน Services ทั้งหมดด้วย Podman Compose

```bash
# รัน services ทั้งหมด (build และ start)
podman-compose up -d

# ดู logs
podman-compose logs -f

# ดู logs เฉพาะ api
podman-compose logs -f api

# ดู logs เฉพาะ mongodb
podman-compose logs -f mongodb
```

### 2. ตรวจสอบ Services

```bash
# ดูสถานะ containers
podman-compose ps

# หรือ
podman ps
```

### 3. ทดสอบ API

```bash
# Test health check
curl http://localhost:3000/health

# ดู users ทั้งหมด
curl http://localhost:3000/users

# สร้าง user ใหม่
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"ทดสอบ ระบบ","email":"test@example.com","role":"user"}'

# ดูสถิติ database
curl http://localhost:3000/stats
```

### 4. หยุดและลบ Services

```bash
# หยุด services
podman-compose stop

# หยุดและลบ containers
podman-compose down

# ลบ containers และ volumes (ข้อมูลจะหายทั้งหมด!)
podman-compose down -v
```

## การทำงานกับ Volumes

### ดู Volumes

```bash
# ดู volumes ทั้งหมด
podman volume ls

# ดูรายละเอียด volume
podman volume inspect 05-database-mongodb_mongodb_data
```

### Backup ข้อมูล

```bash
# Export ข้อมูลจาก MongoDB
podman exec workshop-mongodb mongodump \
  --username admin \
  --password password123 \
  --authenticationDatabase admin \
  --out /data/backup

# Copy backup ออกมา
podman cp workshop-mongodb:/data/backup ./backup
```

### Restore ข้อมูล

```bash
# Copy backup เข้าไปใน container
podman cp ./backup workshop-mongodb:/data/backup

# Restore ข้อมูล
podman exec workshop-mongodb mongorestore \
  --username admin \
  --password password123 \
  --authenticationDatabase admin \
  /data/backup
```

## การทำงานกับ Networks

### ตรวจสอบ Network

```bash
# ดู networks
podman network ls

# ดูรายละเอียด network
podman network inspect 05-database-mongodb_app-network

# ดู containers ใน network
podman network inspect 05-database-mongodb_app-network | grep -A 5 "Containers"
```

### ทดสอบการเชื่อมต่อระหว่าง Containers

```bash
# เข้าไปใน API container
podman exec -it workshop-api /bin/sh

# ทดสอบ ping MongoDB (ใช้ชื่อ service)
ping mongodb

# ทดสอบเชื่อมต่อ MongoDB
wget -qO- http://mongodb:27017
```

## Debug และ Troubleshooting

### ดู Logs

```bash
# Logs ของ API
podman logs workshop-api

# Logs ของ MongoDB
podman logs workshop-mongodb

# Logs แบบ real-time
podman logs -f workshop-api
```

### เข้าไปใน Container

```bash
# เข้าไป API container
podman exec -it workshop-api /bin/sh

# เข้าไป MongoDB container
podman exec -it workshop-mongodb /bin/bash

# เข้าไปใช้ MongoDB shell
podman exec -it workshop-mongodb mongosh \
  -u admin -p password123 --authenticationDatabase admin
```

### ตรวจสอบ Health

```bash
# Health status ของ containers
podman inspect workshop-api | grep -A 10 Health
podman inspect workshop-mongodb | grep -A 10 Health
```

## MongoDB Commands

### ใช้ MongoDB Shell

```bash
# เข้า MongoDB shell
podman exec -it workshop-mongodb mongosh \
  -u admin -p password123 --authenticationDatabase admin

# ใน mongosh:
use workshop
db.users.find()
db.users.countDocuments()
db.users.insertOne({ name: "ใหม่", email: "new@example.com", role: "user", createdAt: new Date() })
```

## คำสั่งที่เป็นประโยชน์

### Rebuild และ Restart

```bash
# Rebuild API image และ restart
podman-compose up -d --build api

# Restart เฉพาะ MongoDB
podman-compose restart mongodb
```

### ดูการใช้ทรัพยากร

```bash
# ดูการใช้ทรัพยากรของทุก container
podman stats

# ดูเฉพาะ containers ใน project นี้
podman stats workshop-api workshop-mongodb
```

### ล้างข้อมูลทั้งหมด

```bash
# หยุดและลบทุกอย่าง รวม volumes
podman-compose down -v

# ลบ network (ถ้าจำเป็น)
podman network prune
```

## Environment Variables

สามารถสร้างไฟล์ `.env` เพื่อกำหนดค่าต่างๆ:

```env
# MongoDB
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=password123
MONGO_INITDB_DATABASE=workshop

# API
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://admin:password123@mongodb:27017/workshop?authSource=admin
```

จากนั้นแก้ไข `podman-compose.yml`:

```yaml
services:
  mongodb:
    env_file: .env
  api:
    env_file: .env
```

## สิ่งที่ได้เรียนรู้

- ✅ การใช้ Podman Compose orchestrate หลาย containers
- ✅ การเชื่อมต่อระหว่าง containers ผ่าน network
- ✅ การใช้ volumes เก็บข้อมูลถาวร
- ✅ การตั้งค่า environment variables
- ✅ การใช้ health checks
- ✅ การ depends_on และ service dependencies
- ✅ การทำงานกับ MongoDB ใน container
- ✅ การ backup และ restore ข้อมูล
