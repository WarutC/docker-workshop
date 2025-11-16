# คำสั่ง Podman พื้นฐาน

## คำสั่งจัดการ Podman Machine

### ดูรายการ Machines

```bash
# แสดง machine ทั้งหมด
podman machine list

# แสดงข้อมูลโดยละเอียด
podman machine inspect <machine-name>
```

### จัดการ Machine

```bash
# สร้าง machine ใหม่
podman machine init

# สร้างและกำหนดชื่อ
podman machine init my-machine

# เริ่ม machine
podman machine start

# หยุด machine
podman machine stop

# รีสตาร์ท machine
podman machine restart

# ลบ machine
podman machine rm <machine-name>

# SSH เข้า machine
podman machine ssh
```

### ตั้งค่า Machine Resources

```bash
# กำหนด CPU และ Memory
podman machine init --cpus 4 --memory 4096

# กำหนด Disk size
podman machine init --disk-size 50
```

## คำสั่งจัดการ Images

```bash
# ดึง image จาก registry
podman pull nginx
podman pull node:18-alpine

# แสดง images ทั้งหมด
podman images

# ค้นหา image
podman search nginx

# ลบ image
podman rmi nginx

# build image จาก Dockerfile
podman build -t myapp:1.0 .

# tag image
podman tag myapp:1.0 myapp:latest

# ดูประวัติของ image
podman history myapp:1.0
```

## คำสั่งจัดการ Containers

```bash
# รัน container
podman run nginx

# รัน container แบบ background (-d = detached)
podman run -d nginx

# รัน container พร้อมตั้งชื่อ
podman run -d --name web nginx

# รัน container พร้อม map port
podman run -d -p 8080:80 nginx

# แสดง containers ที่กำลังรัน
podman ps

# แสดง containers ทั้งหมด (รวมที่หยุด)
podman ps -a

# เริ่ม container
podman start web

# หยุด container
podman stop web

# รีสตาร์ท container
podman restart web

# ลบ container
podman rm web

# ลบ container ที่กำลังรัน (force)
podman rm -f web

# ดู logs ของ container
podman logs web
podman logs -f web  # follow logs

# เข้าไปใน container
podman exec -it web /bin/bash

# ดูสถิติการใช้ทรัพยากร
podman stats

# inspect container
podman inspect web
```

## คำสั่งจัดการ Volumes

```bash
# สร้าง volume
podman volume create mydata

# แสดง volumes ทั้งหมด
podman volume ls

# inspect volume
podman volume inspect mydata

# ลบ volume
podman volume rm mydata

# ลบ volumes ที่ไม่ได้ใช้งาน
podman volume prune

# รัน container พร้อม mount volume
podman run -d -v mydata:/data nginx
```

## คำสั่งจัดการ Networks

```bash
# สร้าง network
podman network create mynetwork

# แสดง networks ทั้งหมด
podman network ls

# inspect network
podman network inspect mynetwork

# ลบ network
podman network rm mynetwork

# รัน container ใน network
podman run -d --network mynetwork nginx
```

## คำสั่งทำความสะอาดระบบ

```bash
# ลบ containers ที่หยุดทั้งหมด
podman container prune

# ลบ images ที่ไม่ได้ใช้งาน
podman image prune

# ลบ volumes ที่ไม่ได้ใช้งาน
podman volume prune

# ลบ networks ที่ไม่ได้ใช้งาน
podman network prune

# ลบทุกอย่างที่ไม่ได้ใช้งาน
podman system prune

# ลบทุกอย่าง รวมทั้ง volumes
podman system prune -a --volumes
```

## คำสั่งอื่นๆ ที่เป็นประโยชน์

```bash
# ดูข้อมูลระบบ
podman info

# ดูเวอร์ชัน
podman version

# แสดงพื้นที่ที่ใช้
podman system df

# แสดง events แบบ real-time
podman events

# export container เป็น tar file
podman export web > web.tar

# import tar file
podman import web.tar myapp:latest

# save image เป็น tar file
podman save nginx > nginx.tar

# load image จาก tar file
podman load < nginx.tar
```

## Tips การใช้งาน

### Alias สำหรับผู้ใช้ Docker

ถ้าคุณคุ้นเคยกับ Docker สามารถสร้าง alias ได้:

```bash
# เพิ่มใน ~/.bashrc หรือ ~/.zshrc
alias docker=podman
alias docker-compose=podman-compose
```

### รัน Container แบบ Rootless

```bash
# Podman สามารถรันโดยไม่ต้องใช้ sudo
podman run -d nginx

# ไม่เหมือน Docker ที่ต้องใช้
# sudo docker run -d nginx
```

### ตรวจสอบ Health ของ Container

```bash
# รัน container พร้อม health check
podman run -d --name web \
  --health-cmd "curl -f http://localhost/ || exit 1" \
  --health-interval 30s \
  nginx

# ดูสถานะ health
podman inspect web | grep -i health
```
