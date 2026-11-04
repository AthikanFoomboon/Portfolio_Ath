# ATHIKAN — Digital Product Portfolio

เว็บไซต์ Portfolio ภาษาไทย สไตล์ Premium Modern สำหรับแสดงตัวอย่างผลงาน 5 โครงการ พร้อมลิงก์เว็บไซต์จริง 3 ระบบ

## เปิดใช้งาน

ดับเบิลคลิก `start.command` (บน macOS) หรือเปิด Terminal แล้วรัน:

```bash
cd /Users/athikan/Documents/Portfolio_Ath
python3 -m http.server 4173
```

เปิดเว็บไซต์ที่ http://127.0.0.1:4173

## โครงสร้าง

- `index.html` — โครงหน้าเว็บและ SEO
- `styles.css` — ดีไซน์และ Responsive Design
- `data.js` — ข้อมูลโปรเจกต์ ภาพ และ URL ที่เปิดได้จริง
- `script.js` — ตัวกรอง การเปิดรายละเอียด แกลเลอรีภาพ เมนูมือถือ และแชร์ลิงก์
- `assets/` — ภาพหน้าระบบและกราฟิก
- `preview-desktop.png` และ `preview-mobile.png` — ภาพทดสอบขนาดจอ

## ปรับข้อมูล

แก้ชื่อโปรเจกต์ คำอธิบาย รูปภาพ และลิงก์ใน `data.js` โดยระบุ `live` เป็น URL จริงเท่านั้น ปุ่ม LIVE WEBSITE จะแสดงเมื่อมี URL

ภาพหน้าระบบ e-REC, TRACXPERT (หน้า Login), Reinventing เป็นภาพจากเว็บจริงที่จับหน้าจอผ่านเบราว์เซอร์ ส่วนตัวอย่างหน้า Dashboard ของ TRACXPERT, PoP Studio และ UBI RMUTL เป็น SVG ที่สร้างจากภาพอ้างอิงที่ให้ไว้; ถ้าต้องการเปลี่ยนเป็นไฟล์ภาพหน้าจอต้นฉบับ ให้วางภาพลงใน `assets/` แล้วเปลี่ยน `cover` และ `images[].src` ใน `data.js`

**หมายเหตุ:** เวอร์ชันนี้ยังไม่ใส่อีเมล เบอร์โทร หรือโซเชียล เนื่องจากยังไม่ได้รับข้อมูลจริง จึงไม่สร้างช่องทางติดต่อลวง

## เผยแพร่

เว็บนี้เป็น Static Website ไม่ต้องมี Backend สามารถ Deploy บน GitHub Pages, Netlify หรือ Vercel ได้ทันที โดยตั้ง root directory ไปยังโฟลเดอร์นี้
