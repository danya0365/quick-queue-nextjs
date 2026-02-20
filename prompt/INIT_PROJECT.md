1. สร้างโปรเจค Quick Queue

อ่านฟีเจอร์ที่เขียนไว้ที่ 
/Users/marosdeeuma/quick-queue-nextjs/prompt/FEATURE.md

ออกแบบ Master Data และ Static data สำหรับโปรเจค

โดยทุกครั้งที่สร้าง page.tsx ต้องทำตาม rule ที่เขียนไว้ที่ /Users/marosdeeuma/quick-queue-nextjs/prompt/CREATE_PAGE_PATTERN.md

ตามหลัก SOLID Clean

2. เริ่มพัฒนาโปรเจคอันดับแรกเลย ต้องสร้างหน้า MainLayout พร้อม Header Footer และใส่ Theme Toggle เพื่อทำ dark mode

MainLayout ต้องให้ออกแบบให้ เป็น Full screen ห้าม scroll อารมณ์เหมือนใช้เว็บแอพ

ให้ใช้ tailwindcss สำหรับทำ style ที่ /Users/marosdeeuma/quick-queue-nextjs/public/styles/index.css

ใช้ font Noto_Sans_Thai จาก  'next/font/google'

3. ออกแบบ Reuse Component ของ MainLayout

ตกแหน่ง component ด้วย animation ด้วย react-spring เช่น ทำ component แบบ สามารถ interact ด้วย mouse hover หรือ mouse click (ระวังการใช้  useTrail เกิดบัค infinite loop)

4. จากนั้นสร้างหน้าแรก ให้สวยงาม
