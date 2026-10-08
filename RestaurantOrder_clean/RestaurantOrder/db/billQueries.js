// เข้าบิลที่เปิดค้างของโต๊ะ ถ้าไม่มีให้เปิดใหม่
export async function openOrGetBill(db, tableId) {
  const open = await db.getFirstAsync(
    "SELECT id FROM bills WHERE table_id = ? AND status = 'open'", [tableId]);
  if (open) return open.id;
  const r = await db.runAsync(
    "INSERT INTO bills (table_id, status, opened_at) VALUES (?, 'open', ?)",
    [tableId, new Date().toISOString()]);
  return r.lastInsertRowId;
}

// ทุกรายการในบิล เรียงตามรอบ พร้อมราคารวมต่อรายการ (ใช้ราคา snapshot ตอนสั่ง)
export const getBillLines = (db, billId) =>
  db.getAllAsync(
    `SELECT o.round_no, oi.id, oi.item_name, oi.qty, oi.unit_price_satang, oi.note, oi.status,
            oi.qty * oi.unit_price_satang AS line_total_satang
     FROM order_items oi JOIN orders o ON o.id = oi.order_id
     WHERE o.bill_id = ?
     ORDER BY o.round_no, oi.id`,
    [billId]
  );

// ยอดรวมทั้งบิลด้วย SQL (ไม่นับรายการที่ยกเลิก)
export async function getBillTotal(db, billId) {
  const row = await db.getFirstAsync(
    `SELECT COALESCE(SUM(oi.qty * oi.unit_price_satang), 0) AS total
     FROM order_items oi JOIN orders o ON o.id = oi.order_id
     WHERE o.bill_id = ? AND oi.status <> 'cancelled'`,
    [billId]
  );
  return row.total;
}

export const closeBill = (db, billId) =>
  db.runAsync(
    "UPDATE bills SET status = 'closed', closed_at = ? WHERE id = ? AND status = 'open'",
    [new Date().toISOString(), billId]
  );

// บิลที่ปิดแล้ว ดูย้อนหลัง
export const getClosedBills = (db) =>
  db.getAllAsync(
    `SELECT b.id, t.label AS table_label, b.closed_at,
            COALESCE(SUM(CASE WHEN oi.status <> 'cancelled' THEN oi.qty * oi.unit_price_satang END), 0) AS total
     FROM bills b
     JOIN dining_tables t ON t.id = b.table_id
     LEFT JOIN orders o ON o.bill_id = b.id
     LEFT JOIN order_items oi ON oi.order_id = o.id
     WHERE b.status = 'closed'
     GROUP BY b.id ORDER BY b.closed_at DESC`
  );
