// เก็บเป็นสตางค์ในฐานข้อมูล แปลงเป็นบาทเฉพาะตอนแสดงผล
export const baht = (satang) =>
  (satang / 100).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ฿';
