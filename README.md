# Workshop Materials - Docker/Podman Training

Materials สำหรับ workshop ช่วงบ่าย (13:00-16:00)

## โครงสร้าง Workshop

```
workshop/
├── 01-installation/
│   └── podman-installation.md       # คู่มือติดตั้ง Podman
├── 02-basic-commands/
│   └── commands.md                  # คำสั่งพื้นฐาน Podman
├── 03-hello-nodejs/
│   ├── index.js                     # Simple Node.js web server
│   ├── package.json
│   ├── Dockerfile
│   └── README.md
├── 04-api-nestjs/
│   ├── src/                         # NestJS source code
│   ├── Dockerfile                   # Multi-stage build
│   ├── package.json
│   └── README.md
├── 05-database-mongodb/
│   ├── src/
│   │   └── server.js               # Express API with MongoDB
│   ├── podman-compose.yml          # Multi-container orchestration
│   ├── Dockerfile
│   └── README.md
└── 06-network-examples/
    └── network-demo.md             # Network types และ examples
```

## เนื้อหา Workshop

### 1. ติดตั้ง Podman (01-installation)

- วิธีติดตั้ง Podman บน Windows, macOS, Linux
- ติดตั้ง Podman Desktop
- ติดตั้ง podman-compose
- ตรวจสอบการติดตั้ง

### 2. คำสั่งพื้นฐาน (02-basic-commands)

- Podman Machine (macOS/Windows)
- คำสั่งจัดการ Images
- คำสั่งจัดการ Containers
- คำสั่งจัดการ Volumes
- คำสั่งจัดการ Networks
- ทำความสะอาดระบบ

### 3. Hello Node.js (03-hello-nodejs)

**เป้าหมาย:** สร้าง simple web application และ containerize

**สิ่งที่จะได้เรียนรู้:**
- การเขียน Dockerfile พื้นฐาน
- การ build image จาก Dockerfile
- การ run container และ map port
- การดู logs และ debug

**เวลาที่ใช้:** 20 นาที

### 4. API with NestJS (04-api-nestjs)

**เป้าหมาย:** สร้าง production-ready API image

**สิ่งที่จะได้เรียนรู้:**
- Multi-stage build
- การใช้ .dockerignore
- การลดขนาด image
- REST API endpoints

**เวลาที่ใช้:** 20 นาที

### 5. Database + Compose (05-database-mongodb)

**เป้าหมาย:** รัน multi-container application

**สิ่งที่จะได้เรียนรู้:**
- Podman Compose
- การเชื่อมต่อ API กับ Database
- Docker Volumes (data persistence)
- Networks (container communication)
- Health checks
- Backup และ restore

**เวลาที่ใช้:** 40 นาที

### 6. Docker Networks (06-network-examples)

**เป้าหมาย:** เข้าใจ network types และการใช้งาน

**สิ่งที่จะได้เรียนรู้:**
- Bridge network
- Host network
- None network
- Custom networks
- Network segmentation
- Best practices

**เวลาที่ใช้:** 25 นาที

## วิธีใช้งาน

### Prerequisites

ติดตั้งเครื่องมือต่อไปนี้:
- Podman (หรือ Docker)
- Podman Compose
- Text Editor (VS Code แนะนำ)
- Terminal/Command Prompt

### รัน Workshops

แต่ละ workshop มี README.md ที่อธิบายวิธีการรันโดยละเอียด

```bash
# Workshop 1: Hello Node.js
cd 03-hello-nodejs
podman build -t hello-nodejs:1.0 .
podman run -d -p 3000:3000 --name hello-app hello-nodejs:1.0

# Workshop 2: NestJS API
cd 04-api-nestjs
podman build -t api-nestjs:1.0 .
podman run -d -p 3000:3000 --name api-app api-nestjs:1.0

# Workshop 3: Database + Compose
cd 05-database-mongodb
podman-compose up -d
```

## Timeline Workshop (13:00-16:00)

| เวลา | กิจกรรม | ระยะเวลา |
| --- | --- | --- |
| 13:00-13:30 | ติดตั้ง Podman | 30 นาที |
| 13:30-13:45 | คำสั่งพื้นฐาน & Podman Machine | 15 นาที |
| 13:45-14:00 | Build Image with Dockerfile | 15 นาที |
| 14:00-14:20 | Workshop 1: Hello Node.js | 20 นาที |
| 14:20-14:40 | Workshop 2: NestJS API | 20 นาที |
| 14:40-15:20 | Workshop 3: Database + Compose | 40 นาที |
| 15:20-15:45 | Docker Networks | 25 นาที |
| 15:45-16:00 | Q&A และสรุป | 15 นาที |

## Tips สำหรับ Speaker

### การเตรียมตัว

1. ✅ ติดตั้ง Podman ล่วงหน้า
2. ✅ Pull images ที่จำเป็นก่อน (node:18-alpine, mongo:7.0, nginx)
3. ✅ ทดสอบ workshop ทุกตัวก่อนสอน
4. ✅ เตรียม backup plan กรณี internet ล่ม (local registry)

### ระหว่างสอน

1. 🎯 ทำให้ดูทีละขั้นตอน อธิบายชัดเจน
2. 🎯 ให้เวลาผู้เข้าอบรมทำตาม
3. 🎯 เช็คว่าทุกคนทำได้ก่อนไปต่อ
4. 🎯 อธิบาย error messages ที่อาจจะเจอ
5. 🎯 แสดง best practices และ tips

### Troubleshooting พบบ่อย

**ปัญหา: Port already in use**
```bash
# แก้: เปลี่ยน port หรือหยุด container เก่า
podman stop $(podman ps -q)
```

**ปัญหา: Image build ช้า**
```bash
# แก้: Pull base images ล่วงหน้า
podman pull node:18-alpine
podman pull mongo:7.0
```

**ปัญหา: Container ไม่สามารถเชื่อมต่อกันได้**
```bash
# แก้: ตรวจสอบ network
podman network ls
podman network inspect <network-name>
```

## คำสั่งที่เป็นประโยชน์

### เตรียม Environment

```bash
# Pull images ล่วงหน้า
podman pull node:18-alpine
podman pull mongo:7.0
podman pull nginx:alpine
podman pull postgres:15
podman pull redis:alpine

# สร้าง networks ล่วงหน้า
podman network create workshop-net
```

### ทำความสะอาดระหว่าง Workshops

```bash
# หยุดและลบ containers ทั้งหมด
podman stop $(podman ps -aq)
podman rm $(podman ps -aq)

# ลบ networks ที่สร้างขึ้น
podman network prune

# ลบ volumes (ระวัง!)
podman volume prune
```

### Debug

```bash
# ดู logs
podman logs <container-name>
podman logs -f <container-name>

# เข้าไปใน container
podman exec -it <container-name> /bin/sh

# ดูการใช้ทรัพยากร
podman stats

# ตรวจสอบ network
podman network inspect <network-name>
```

## Resources

### Documentation

- [Podman Documentation](https://docs.podman.io)
- [Docker Documentation](https://docs.docker.com)
- [NestJS Documentation](https://docs.nestjs.com)
- [MongoDB Documentation](https://www.mongodb.com/docs)

### Cheat Sheets

- [Podman Cheat Sheet](https://podman.io/whatis.html)
- [Dockerfile Reference](https://docs.docker.com/engine/reference/builder/)
- [Compose File Reference](https://docs.docker.com/compose/compose-file/)

## License

Materials นี้สร้างขึ้นสำหรับ Docker Training Workshop
กระทรวงการต่างประเทศ (November 17, 2025)
