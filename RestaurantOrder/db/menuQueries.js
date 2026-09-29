export const getCategories = (db) =>
  db.getAllAsync('SELECT id, name FROM categories ORDER BY id');

// ค้นหาตามชื่อ (ไม่ใส่ categoryId = ทุกหมวด) เฉพาะรายการที่ยังมีของ
export const getMenu = (db, { categoryId = null, search = '' } = {}) =>
  db.getAllAsync(
    `SELECT id, name, price_satang FROM menu_items
     WHERE is_available = 1
       AND (? IS NULL OR category_id = ?)
       AND name LIKE ?
     ORDER BY id`,
    [categoryId, categoryId, `%${search}%`]
  );

export const setAvailable = (db, id, available) =>
  db.runAsync('UPDATE menu_items SET is_available = ? WHERE id = ?', [available ? 1 : 0, id]);

export const updatePrice = (db, id, priceSatang) =>
  db.runAsync('UPDATE menu_items SET price_satang = ? WHERE id = ?', [priceSatang, id]);
