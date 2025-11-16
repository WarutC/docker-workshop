# Hello Node.js - Workshop Example

Simple Hello World application ที่ใช้ Node.js

## ขั้นตอนการ Build และ Run

### 1. Build Image

```bash
# Build image และตั้งชื่อ tag
podman build -t hello-nodejs:1.0 .

# ตรวจสอบ image ที่สร้างเสร็จ
podman images | grep hello-nodejs
```

### 2. Run Container

```bash
# รัน container แบบ foreground
podman run -p 3000:3000 hello-nodejs:1.0

# หรือรัน container แบบ background (detached)
podman run -d -p 3000:3000 --name hello-app hello-nodejs:1.0

# ดู logs
podman logs hello-app

# ดู logs แบบ real-time
podman logs -f hello-app
```

### 3. ทดสอบ Application

เปิดเบราว์เซอร์ไปที่: `http://localhost:3000`

หรือใช้ curl:

```bash
curl http://localhost:3000
```

### 4. ดูข้อมูล Container

```bash
# ดูสถานะ container
podman ps

# ดูการใช้ทรัพยากร
podman stats hello-app

# inspect container
podman inspect hello-app
```

### 5. หยุดและลบ Container

```bash
# หยุด container
podman stop hello-app

# ลบ container
podman rm hello-app

# ลบ image
podman rmi hello-nodejs:1.0
```

## คำสั่งรวมทั้งหมด (One-liner)

```bash
# Build, Run และเปิดเบราว์เซอร์
podman build -t hello-nodejs:1.0 . && \
  podman run -d -p 3000:3000 --name hello-app hello-nodejs:1.0 && \
  echo "✅ Application running at http://localhost:3000"
```

## เคล็ดลับ

### ดู Dockerfile Instruction ทีละขั้นตอน

```bash
# ดู history ของ image
podman history hello-nodejs:1.0
```

### รัน Container แบบ Interactive

```bash
# เข้าไปใน container เพื่อ debug
podman run -it hello-nodejs:1.0 /bin/sh

# หรือเข้าไปใน container ที่กำลังรัน
podman exec -it hello-app /bin/sh
```

### Override CMD

```bash
# รัน container แต่ใช้คำสั่งอื่นแทน
podman run -it hello-nodejs:1.0 /bin/sh
```

## สิ่งที่ได้เรียนรู้

- ✅ การเขียน Dockerfile พื้นฐาน
- ✅ การ build image จาก Dockerfile
- ✅ การ run container และ map port
- ✅ การดู logs และ debug container
- ✅ การจัดการ container lifecycle
