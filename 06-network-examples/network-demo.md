# Docker/Podman Network Types - Workshop

คู่มือสำหรับทดลอง network types ต่างๆ ใน Docker/Podman

## ประเภทของ Network

### 1. Bridge Network (Default)

เป็น network แบบ default ที่ containers ใช้เชื่อมต่อกันภายใน host เดียวกัน

#### คุณสมบัติ

- ✅ Isolated network สำหรับ containers
- ✅ Containers สามารถสื่อสารกันได้ผ่านชื่อ container
- ✅ ต้อง publish port (-p) เพื่อเข้าถึงจากภายนอก
- ✅ เหมาะสำหรับ single-host deployments

#### ตัวอย่างการใช้งาน

```bash
# สร้าง custom bridge network
podman network create my-bridge-network

# ดูรายการ networks
podman network ls

# ดูรายละเอียด network
podman network inspect my-bridge-network

# รัน containers ใน network เดียวกัน
podman run -d --name web1 --network my-bridge-network nginx
podman run -d --name web2 --network my-bridge-network nginx

# ทดสอบการเชื่อมต่อระหว่าง containers
podman exec web1 ping web2

# เข้าไปใน container และทดสอบ
podman exec -it web1 /bin/sh
# ใน container:
ping web2
curl http://web2

# ลบ network (ต้องหยุด containers ก่อน)
podman stop web1 web2
podman rm web1 web2
podman network rm my-bridge-network
```

#### ตัวอย่าง Multi-container Communication

```bash
# สร้าง network
podman network create app-net

# รัน database
podman run -d \
  --name db \
  --network app-net \
  -e MYSQL_ROOT_PASSWORD=password \
  mysql:8.0

# รัน app ที่เชื่อมต่อกับ database
podman run -d \
  --name app \
  --network app-net \
  -p 8080:80 \
  -e DATABASE_HOST=db \
  your-app:latest

# app สามารถเชื่อมต่อกับ db ผ่าน hostname "db"
```

---

### 2. Host Network

Container ใช้ network stack ของ host โดยตรง (ไม่มี network isolation)

#### คุณสมบัติ

- ✅ Performance สูงสุด (ไม่มี NAT overhead)
- ⚠️ ไม่มี isolation
- ⚠️ Port conflicts กับ host
- ✅ เหมาะสำหรับ high-performance applications

#### ตัวอย่างการใช้งาน

```bash
# รัน container ด้วย host network
podman run -d --name web-host --network host nginx

# Container จะใช้ network ของ host โดยตรง
# ไม่ต้อง publish port (-p)
# nginx จะฟังที่ port 80 บน host โดยตรง

# ทดสอบ
curl http://localhost:80

# ดูข้อมูล network
podman inspect web-host | grep -A 10 NetworkSettings

# ลบ container
podman stop web-host
podman rm web-host
```

#### เมื่อไหร่ควรใช้ Host Network?

- ✅ ต้องการ performance สูงสุด
- ✅ Application ต้องเข้าถึง network interfaces ของ host
- ✅ ทำงานกับ multicast/broadcast traffic
- ❌ ไม่เหมาะสำหรับ multiple containers ที่ใช้ port เดียวกัน

---

### 3. None Network

Container ไม่มี network interface (isolated ทั้งหมด)

#### คุณสมบัติ

- ✅ Maximum isolation
- ✅ Security สูงสุด
- ❌ ไม่สามารถเชื่อมต่อ network ได้
- ✅ เหมาะสำหรับ security-sensitive workloads

#### ตัวอย่างการใช้งาน

```bash
# รัน container โดยไม่มี network
podman run -d --name isolated --network none alpine sleep 3600

# เข้าไปใน container
podman exec -it isolated /bin/sh

# ทดสอบ network (จะไม่สามารถเชื่อมต่อได้)
ping 8.8.8.8  # จะไม่สำเร็จ
curl http://example.com  # จะไม่สำเร็จ

# ดู network interfaces (จะมีแค่ loopback)
ip addr

# ลบ container
podman stop isolated
podman rm isolated
```

#### เมื่อไหร่ควรใช้ None Network?

- ✅ Batch processing ที่ไม่ต้องการ network
- ✅ Security-sensitive applications
- ✅ Offline data processing
- ✅ Testing isolation

---

### 4. Custom Network (User-defined Bridge)

สร้าง network เองพร้อมการตั้งค่าเฉพาะ

#### ตัวอย่างการสร้าง Custom Network

```bash
# สร้าง network พร้อมกำหนด subnet
podman network create \
  --subnet 172.20.0.0/16 \
  --gateway 172.20.0.1 \
  custom-net

# ดูรายละเอียด
podman network inspect custom-net

# รัน container พร้อมกำหนด IP
podman run -d \
  --name web \
  --network custom-net \
  --ip 172.20.0.10 \
  nginx

# รัน container อีกตัว
podman run -d \
  --name app \
  --network custom-net \
  --ip 172.20.0.11 \
  alpine sleep 3600

# ทดสอบการเชื่อมต่อ
podman exec app ping 172.20.0.10
podman exec app ping web
```

---

## Workshop Exercises

### Exercise 1: Bridge Network Communication

สร้าง web application ที่ใช้ nginx + redis

```bash
# สร้าง network
podman network create webapp-net

# รัน Redis
podman run -d \
  --name redis \
  --network webapp-net \
  redis:alpine

# รัน Nginx
podman run -d \
  --name web \
  --network webapp-net \
  -p 8080:80 \
  nginx

# ทดสอบว่า nginx เชื่อมต่อ redis ได้
podman exec web ping redis

# ทดสอบจากภายนอก
curl http://localhost:8080
```

**คำถาม:**

1. Nginx สามารถ ping Redis ได้หรือไม่?
2. ถ้าไม่ระบุ --network จะเชื่อมต่อกันได้ไหม?

---

### Exercise 2: เปรียบเทียบ Host vs Bridge Network

```bash
# ทดสอบ Bridge Network
podman run --rm --network bridge alpine ping -c 3 8.8.8.8

# ทดสอบ Host Network
podman run --rm --network host alpine ping -c 3 8.8.8.8

# เปรียบเทียบ latency และ performance
```

---

### Exercise 3: Network Isolation

สร้าง 2 networks แยกกัน เพื่อทดสอบ isolation

```bash
# สร้าง 2 networks
podman network create frontend-net
podman network create backend-net

# รัน containers ใน networks ต่างกัน
podman run -d --name frontend --network frontend-net nginx
podman run -d --name backend --network backend-net redis

# ทดสอบ - ควรไม่สามารถ ping กันได้
podman exec frontend ping backend  # Should fail

# เชื่อม frontend เข้ากับ backend-net
podman network connect backend-net frontend

# ทดสอบอีกครั้ง - ตอนนี้ควร ping ได้แล้ว
podman exec frontend ping backend  # Should work
```

---

### Exercise 4: Multi-tier Application

สร้าง application 3 tiers: frontend, backend, database

```bash
# สร้าง networks
podman network create frontend-net
podman network create backend-net

# Database (backend-net only)
podman run -d \
  --name db \
  --network backend-net \
  -e POSTGRES_PASSWORD=password \
  postgres:15

# Backend API (both networks)
podman run -d \
  --name api \
  --network backend-net \
  nginx
podman network connect frontend-net api

# Frontend (frontend-net only)
podman run -d \
  --name web \
  --network frontend-net \
  -p 8080:80 \
  nginx

# ตรวจสอบ connectivity:
# ✅ web -> api (ผ่าน frontend-net)
# ✅ api -> db (ผ่าน backend-net)
# ❌ web -> db (isolated)
```

---

## คำสั่งที่เป็นประโยชน์

### ดูข้อมูล Network

```bash
# แสดง networks ทั้งหมด
podman network ls

# ดูรายละเอียด network
podman network inspect <network-name>

# ดู containers ใน network
podman network inspect <network-name> | grep -A 5 "Containers"

# แสดง network ของ container
podman inspect <container-name> | grep -A 10 "Networks"
```

### จัดการ Network

```bash
# สร้าง network
podman network create <network-name>

# ลบ network
podman network rm <network-name>

# ลบ networks ที่ไม่ได้ใช้งาน
podman network prune

# เชื่อม container เข้า network
podman network connect <network-name> <container-name>

# ตัด container ออกจาก network
podman network disconnect <network-name> <container-name>
```

### Debug Network

```bash
# ดู network interfaces ใน container
podman exec <container> ip addr

# ดู routing table
podman exec <container> ip route

# Test connectivity
podman exec <container> ping <target>

# Test DNS resolution
podman exec <container> nslookup <hostname>

# ดู network traffic
podman exec <container> tcpdump -i eth0
```

---

## Best Practices

### 1. ใช้ Custom Bridge Networks

```bash
# ❌ ไม่ดี - ใช้ default bridge
podman run -d nginx

# ✅ ดี - ใช้ custom network
podman network create my-app-net
podman run -d --network my-app-net nginx
```

**เพราะอะไร?**

- Custom networks รองรับ automatic DNS resolution
- ควบคุม isolation ได้ดีกว่า
- สามารถกำหนด subnet, gateway ได้

### 2. ตั้งชื่อ Networks ให้สื่อความหมาย

```bash
# ❌ ไม่ดี
podman network create net1

# ✅ ดี
podman network create frontend-network
podman network create backend-network
podman network create database-network
```

### 3. ใช้ Network Segmentation

แบ่ง networks ตาม security zones:

```
frontend-net: web, load balancer
backend-net: api, app servers
database-net: databases only
```

### 4. ทำความสะอาด Networks

```bash
# ลบ networks ที่ไม่ได้ใช้งาน
podman network prune

# หรือระบุเฉพาะที่ต้องการลบ
podman network rm <network-name>
```

---

## สรุป

| Network Type | Isolation | Performance | Use Case |
| --- | --- | --- | --- |
| **Bridge** | ✅ ดี | ✅ ดี | Default, multi-container apps |
| **Host** | ❌ ไม่มี | ✅✅ ดีที่สุด | High-performance apps |
| **None** | ✅✅ ดีที่สุด | N/A | Maximum security, offline |
| **Custom** | ✅✅ ควบคุมได้ | ✅ ดี | Production applications |

---

## สิ่งที่ได้เรียนรู้

- ✅ ความแตกต่างระหว่าง network types
- ✅ วิธีสร้างและจัดการ networks
- ✅ การเชื่อมต่อ containers เข้า networks
- ✅ Network isolation และ segmentation
- ✅ Best practices สำหรับ production
- ✅ การ debug network issues
