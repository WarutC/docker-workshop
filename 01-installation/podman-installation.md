# การติดตั้ง Podman

## Podman คืออะไร?

Podman เป็น container engine ที่เป็นทางเลือกอีกทางหนึ่งแทน Docker โดยมีข้อดีคือ:

- **Daemonless**: ไม่ต้องมี daemon รันอยู่ตลอดเวลา
- **Rootless**: รันได้โดยไม่ต้องใช้ root privileges
- **Docker Compatible**: คำสั่งเหมือนกับ Docker (แค่เปลี่ยน `docker` เป็น `podman`)
- **Pod Support**: รองรับ Kubernetes pod natively

## การติดตั้ง Podman

### Windows

```bash
# ดาวน์โหลด Podman Desktop
# https://podman-desktop.io/downloads

# หรือใช้ Chocolatey
choco install podman-desktop

# หรือใช้ winget
winget install -e --id RedHat.Podman-Desktop
```

### macOS

```bash
# ใช้ Homebrew
brew install podman

# ติดตั้ง Podman Desktop (GUI)
brew install --cask podman-desktop
```

### Linux (Ubuntu/Debian)

```bash
# Ubuntu 22.04 ขึ้นไป
sudo apt-get update
sudo apt-get install -y podman

# หรือติดตั้งจาก official repository
. /etc/os-release
echo "deb https://download.opensuse.org/repositories/devel:/kubic:/libpod:/stable/xUbuntu_${VERSION_ID}/ /" | \
  sudo tee /etc/apt/sources.list.d/devel:kubic:libpod:stable.list
curl -L "https://download.opensuse.org/repositories/devel:/kubic:/libpod:/stable/xUbuntu_${VERSION_ID}/Release.key" | \
  sudo apt-key add -
sudo apt-get update
sudo apt-get -y install podman
```

## เริ่มต้นใช้งาน Podman

### สร้าง Podman Machine (macOS/Windows)

```bash
# สร้าง machine ใหม่
podman machine init

# เริ่มต้น machine
podman machine start

# ตรวจสอบสถานะ
podman machine list
```

### ตรวจสอบการติดตั้ง

```bash
# ตรวจสอบเวอร์ชัน
podman --version

# ตรวจสอบข้อมูลระบบ
podman info

# ทดสอบรัน container
podman run hello-world
```

## ติดตั้ง Podman Compose

```bash
# macOS
brew install podman-compose

# Linux
pip3 install podman-compose

# หรือ
sudo apt-get install podman-compose
```

## ทดสอบว่าติดตั้งสำเร็จ

```bash
# ตรวจสอบ podman
podman --version

# ตรวจสอบ podman-compose
podman-compose --version

# รัน hello-world
podman run --rm hello-world
```

ถ้าเห็นข้อความ "Hello from Docker!" (หรือ Podman) แสดงว่าติดตั้งสำเร็จแล้ว!
