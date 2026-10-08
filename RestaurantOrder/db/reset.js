// ล้างข้อมูลการขาย (บิล/รอบสั่ง/รายการ) โดยเก็บเมนูและโต๊ะไว้
export async function resetSales(db) {
  await db.execAsync('DELETE FROM bills;'); // ON DELETE CASCADE ลบ orders, order_items ตาม
}
