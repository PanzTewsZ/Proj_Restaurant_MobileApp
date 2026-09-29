// ส่งออร์เดอร์ 1 รอบ = ทรานแซกชันเดียว (สำเร็จทั้งรอบหรือไม่ลงเลย)
// ราคา/ชื่อถูกคัดลอกจาก menu_items ตอน INSERT เพื่อให้บิลเก่าไม่เปลี่ยนเมื่อแก้ราคาภายหลัง
export async function submitRound(db, billId, cart) {
  if (!cart.length) throw new Error('ตะกร้าว่าง');
  await db.withExclusiveTransactionAsync(async (tx) => {
    const { n } = await tx.getFirstAsync(
      'SELECT COALESCE(MAX(round_no), 0) + 1 AS n FROM orders WHERE bill_id = ?', [billId]);
    const r = await tx.runAsync(
      'INSERT INTO orders (bill_id, round_no, created_at) VALUES (?, ?, ?)',
      [billId, n, new Date().toISOString()]);
    for (const it of cart) {
      await tx.runAsync(
        `INSERT INTO order_items (order_id, menu_item_id, item_name, unit_price_satang, qty, note)
         SELECT ?, id, name, price_satang, ?, ? FROM menu_items WHERE id = ?`,
        [r.lastInsertRowId, it.qty, it.note || null, it.menuItemId]);
    }
  });
}

// ยกเลิกได้เฉพาะรายการที่ครัวยังไม่ลงมือทำ
export const cancelItem = (db, itemId) =>
  db.runAsync(
    "UPDATE order_items SET status = 'cancelled', cancelled_at = ? WHERE id = ? AND status = 'pending'",
    [new Date().toISOString(), itemId]);
