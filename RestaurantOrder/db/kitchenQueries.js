// คิวครัว: เก่าสุดขึ้นก่อน พร้อมโต๊ะ/รอบ/หมายเหตุ
export const getQueue = (db) =>
  db.getAllAsync(
    `SELECT oi.id, t.label AS table_label, o.round_no, oi.item_name, oi.qty, oi.note, oi.status, o.created_at
     FROM order_items oi
     JOIN orders o ON o.id = oi.order_id
     JOIN bills b ON b.id = o.bill_id
     JOIN dining_tables t ON t.id = b.table_id
     WHERE oi.status IN ('pending', 'cooking')
     ORDER BY o.created_at ASC, oi.id ASC`
  );

export const setItemStatus = (db, itemId, status) =>
  db.runAsync('UPDATE order_items SET status = ? WHERE id = ?', [status, itemId]);
