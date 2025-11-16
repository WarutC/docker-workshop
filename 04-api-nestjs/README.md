# NestJS API - Workshop Example

NestJS REST API application สำหรับ Workshop

## โครงสร้าง Project

```
04-api-nestjs/
├── src/
│   ├── main.ts           # Entry point
│   ├── app.module.ts     # Root module
│   ├── app.controller.ts # Controller
│   └── app.service.ts    # Service
├── Dockerfile            # Multi-stage build
├── package.json
├── tsconfig.json
└── nest-cli.json
```

## API Endpoints

- `GET /` - ข้อมูลหลักและรายการ endpoints
- `GET /health` - Health check endpoint
- `GET /info` - ข้อมูล application และ container
- `GET /users` - รายการ users (mock data)

## ขั้นตอนการ Build และ Run

### 1. Build Image (Multi-stage Build)

```bash
# Build image
podman build -t api-nestjs:1.0 .

# ตรวจสอบขนาด image
podman images | grep api-nestjs
```

**หมายเหตุ:** Dockerfile ใช้ multi-stage build เพื่อให้ image มีขนาดเล็กลง

### 2. Run Container

```bash
# รัน container
podman run -d -p 3000:3000 --name api-app api-nestjs:1.0

# ดู logs
podman logs -f api-app
```

### 3. ทดสอบ API

```bash
# ทดสอบ root endpoint
curl http://localhost:3000

# ทดสอบ health check
curl http://localhost:3000/health

# ทดสอบ info endpoint
curl http://localhost:3000/info

# ทดสอบ users endpoint
curl http://localhost:3000/users
```

### 4. ตัวอย่างผลลัพธ์

**GET /**

```json
{
  "message": "สวัสดี จาก NestJS API!",
  "status": "running",
  "containerInfo": {
    "hostname": "abc123def456",
    "nodeVersion": "v18.x.x",
    "platform": "linux"
  },
  "endpoints": {
    "health": "/health",
    "info": "/info",
    "users": "/users"
  }
}
```

**GET /health**

```json
{
  "status": "OK",
  "timestamp": "2025-11-17T10:30:00.000Z",
  "uptime": 123.456,
  "memory": {
    "rss": 52428800,
    "heapTotal": 18874368,
    "heapUsed": 12345678
  }
}
```

## Development Mode (Local)

### ติดตั้ง Dependencies

```bash
npm install
```

### รัน Development Server

```bash
# Development mode with watch
npm run start:dev
```

### Build Production

```bash
npm run build
npm run start:prod
```

## Docker Best Practices

### 1. Multi-stage Build

Dockerfile นี้ใช้ multi-stage build:

- **Stage 1 (builder)**: Build TypeScript code
- **Stage 2 (production)**: รัน application พร้อม production dependencies เท่านั้น

ทำให้ image มีขนาดเล็กลง เพราะไม่มี devDependencies และ source code

### 2. .dockerignore

ไฟล์ `.dockerignore` ช่วยให้:
- ไม่ copy `node_modules` เข้าไปใน image
- ลดขนาด build context
- Build เร็วขึ้น

### 3. Environment Variables

```bash
# รัน container พร้อมกำหนด environment
podman run -d \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  --name api-app \
  api-nestjs:1.0
```

## การจัดการ Container

```bash
# ดูสถานะ
podman ps

# ดู logs แบบ real-time
podman logs -f api-app

# ดูการใช้ทรัพยากร
podman stats api-app

# เข้าไปใน container
podman exec -it api-app /bin/sh

# หยุดและลบ
podman stop api-app
podman rm api-app
```

## เปรียบเทียบ Image Size

```bash
# ดูขนาด image
podman images

# เปรียบเทียบกับ image ที่ไม่ใช้ multi-stage build
# Multi-stage: ~200MB
# Single-stage with dev dependencies: ~500MB+
```

## สิ่งที่ได้เรียนรู้

- ✅ การสร้าง NestJS REST API
- ✅ Multi-stage build ใน Dockerfile
- ✅ การใช้ .dockerignore
- ✅ การตั้งค่า environment variables
- ✅ Health check endpoints
- ✅ Best practices สำหรับ production image
