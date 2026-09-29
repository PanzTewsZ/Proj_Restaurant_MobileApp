// ยอดขายรายวัน แยกหมวด (date รูปแบบ YYYY-MM-DD ตามเวลาเครื่อง)
export const dailySalesByCategory = (db, date) =>
  db.getAllAsync(
    `SELECT COALESCE(c.name, 'อื่นๆ') AS category, SUM(oi.qty * oi.unit_price_satang) AS total
     FROM order_items oi
     JOIN orders o ON o.id = oi.order_id
     LEFT JOIN menu_items m ON m.id = oi.menu_item_id
     LEFT JOIN categories c ON c.id = m.category_id
     WHERE oi.status <> 'cancelled' AND date(o.created_at, 'localtime') = ?
     GROUP BY category ORDER BY total DESC`,
    [date]
  );

// 10 อันดับเมนูขายดีในช่วงวันที่
export const topItems = (db, fromDate, toDate) =>
  db.getAllAsync(
    `SELECT oi.item_name, SUM(oi.qty) AS qty
     FROM order_items oi JOIN orders o ON o.id = oi.order_id
     WHERE oi.status <> 'cancelled' AND date(o.created_at, 'localtime') BETWEEN ? AND ?
     GROUP BY oi.item_name ORDER BY qty DESC LIMIT 10`,
    [fromDate, toDate]
  );
