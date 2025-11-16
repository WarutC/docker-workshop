# Session 2: Workshop - Hands-on with Podman

Slide presentation สำหรับ workshop ช่วงบ่าย

## ไฟล์ Presentation

- `workshop-session.md` - Marp presentation สำหรับ workshop

## เนื้อหาที่ครอบคลุม

1. **ติดตั้ง Podman** (13:00-13:30)
   - Podman คืออะไร
   - วิธีติดตั้งบน Windows, macOS, Linux
   - ตรวจสอบการติดตั้ง

2. **คำสั่งพื้นฐานและ Podman Machine** (13:30-13:45)
   - Podman Machine
   - คำสั่งจัดการ Images
   - คำสั่งจัดการ Containers
   - คำสั่ง Exec และ Debug

3. **Build Image with Dockerfile** (13:45-14:00)
   - Dockerfile คืออะไร
   - Dockerfile Instructions
   - วิธี Build Image

4. **Workshop 1: Hello Node.js** (14:00-14:20)
   - สร้าง simple Node.js web server
   - เขียน Dockerfile
   - Build และ Run container

5. **Workshop 2: API with NestJS** (14:20-14:40)
   - สร้าง REST API
   - Multi-stage build
   - Production-ready image

6. **Workshop 3: Database + Compose** (14:40-15:20)
   - API + MongoDB
   - Podman Compose
   - Docker Volumes
   - Backup และ Restore

7. **Docker Networks** (15:20-15:45)
   - Network Types (Bridge, Host, None)
   - Custom Networks
   - Network Segmentation
   - Best Practices

8. **สรุปและ Q&A** (15:45-16:00)

## วิธีใช้งาน Presentation

### ติดตั้ง Marp CLI

```bash
npm install -g @marp-team/marp-cli
```

### Generate PDF

```bash
marp workshop-session.md -o workshop-session.pdf
```

### Generate HTML

```bash
marp workshop-session.md -o workshop-session.html
```

### Live Preview

```bash
marp -w workshop-session.md
```

### ใช้ VS Code

ติดตั้ง extension **Marp for VS Code** แล้วเปิดไฟล์ `workshop-session.md`

## การเตรียมตัวก่อนสอน

### 1. ตรวจสอบ Software

- ✅ Podman ติดตั้งและทำงานได้
- ✅ Podman Compose ติดตั้งแล้ว
- ✅ Text Editor พร้อมใช้งาน

### 2. Pull Images ล่วงหน้า

```bash
podman pull node:18-alpine
podman pull mongo:7.0
podman pull nginx:alpine
```

### 3. ทดสอบ Workshops

ลองรัน workshops ทั้งหมดเพื่อให้แน่ใจว่าทำงานได้:

```bash
# ทดสอบ workshop 1
cd ../workshop/03-hello-nodejs
podman build -t hello-nodejs:1.0 .
podman run -d -p 3000:3000 --name hello-app hello-nodejs:1.0
curl http://localhost:3000
podman stop hello-app && podman rm hello-app

# ทดสอบ workshop 2
cd ../04-api-nestjs
podman build -t api-nestjs:1.0 .
podman run -d -p 3000:3000 --name api-app api-nestjs:1.0
curl http://localhost:3000/health
podman stop api-app && podman rm api-app

# ทดสอบ workshop 3
cd ../05-database-mongodb
podman-compose up -d
curl http://localhost:3000/users
podman-compose down
```

### 4. เตรียม Backup Plan

กรณี internet ล่มหรือมีปัญหา:
- มี images ทั้งหมดใน local
- มี workshop files ใน USB drive
- มี PDF version ของ slides

## Tips การนำเสนอ

### Pacing

- ใช้เวลาตาม agenda ที่กำหนด
- ให้เวลาผู้เข้าอบรมทำตามแต่ละ workshop
- เช็คว่าทุกคนทำได้ก่อนไปต่อ

### การสาธิต

- ทำให้ดูทีละขั้นตอนอย่างชัดเจน
- อธิบายว่าแต่ละคำสั่งทำอะไร
- แสดง output และอธิบาย
- แสดง common errors และวิธีแก้

### Q&A

- ให้เวลา Q&A ระหว่างทำ workshop
- ตอบคำถามให้ชัดเจน
- ถ้าคำถามซับซ้อน บันทึกไว้ตอบในช่วง Q&A สุดท้าย

## Troubleshooting พบบ่อย

### Port Already in Use

```bash
# แก้: ใช้ port อื่น หรือหยุด container เก่า
podman stop $(podman ps -q)
podman rm $(podman ps -aq)
```

### Image Build Slow

```bash
# แก้: Pull base images ล่วงหน้า
podman pull node:18-alpine
```

### Network Issues

```bash
# แก้: ตรวจสอบ network configuration
podman network ls
podman network inspect <network-name>
```

### MongoDB Connection Failed

```bash
# แก้: ตรวจสอบว่า MongoDB container รันอยู่
podman ps
podman logs workshop-mongodb

# ตรวจสอบ network
podman network inspect 05-database-mongodb_app-network
```

## Demo Checklist

ก่อนเริ่มแต่ละ workshop ให้เช็ค:

- [ ] Terminal/Command Prompt เปิดไว้
- [ ] อยู่ใน directory ที่ถูกต้อง
- [ ] ไม่มี container เก่าที่ใช้ port ซ้ำ
- [ ] มี images ที่จำเป็น (pull ล่วงหน้า)
- [ ] Browser เปิดพร้อม (สำหรับทดสอบ)

## Resources สำหรับผู้เข้าอบรม

หลังจบ workshop แจก:

1. 📁 Workshop files (USB หรือ shared drive)
2. 📄 PDF slides
3. 🔗 Links ไป documentation
4. 📧 Contact information สำหรับติดตาม

## Contact

หากมีคำถามเกี่ยวกับ slides หรือ workshop materials:

- Email: [your-email]
- GitHub: [repository-url]

---

**สร้างเมื่อ:** November 2025
**สำหรับ:** Docker/Podman Training - Ministry of Foreign Affairs
