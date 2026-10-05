// รายชื่อโต๊ะ พร้อมเลขบิลที่เปิดค้าง (ถ้ามี)
export const getTablesWithStatus = (db) =>
  db.getAllAsync(
    `SELECT t.id, t.label, b.id AS open_bill_id
     FROM dining_tables t
     LEFT JOIN bills b ON b.table_id = t.id AND b.status = 'open'
     ORDER BY t.id`
  );
