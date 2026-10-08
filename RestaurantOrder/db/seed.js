// ข้อมูลตั้งต้น: 5 หมวด x 5 รายการ = 25 เมนู, 15 โต๊ะ (ราคาเป็นบาท แปลงเป็นสตางค์ตอนใส่)
const MENU = [
  ['อาหารจานเดียว', [
    ['ผัดกะเพราหมูสับ', 'Basil Pork with Rice', 60],
    ['ข้าวผัดกุ้ง', 'Shrimp Fried Rice', 70],
    ['ข้าวมันไก่', 'Chicken Rice', 55],
    ['ผัดซีอิ๊วหมู', 'Stir-Fried Rice Noodles with Pork', 60],
    ['ข้าวไข่เจียวหมูสับ', 'Omelet with Minced Pork and Rice', 50]
  ]],
  ['ต้ม/แกง', [
    ['ต้มยำกุ้ง', 'Tom Yum Goong', 120],
    ['แกงเขียวหวานไก่', 'Green Curry with Chicken', 90],
    ['ต้มข่าไก่', 'Tom Kha Gai', 90],
    ['แกงส้มชะอมกุ้ง', 'Sour Curry with Shrimp and Acacia Omelet', 100],
    ['ต้มจืดเต้าหู้หมูสับ', 'Clear Soup with Tofu and Minced Pork', 70]
  ]],
  ['ของทอด/ยำ', [
    ['ไก่ทอด', 'Fried Chicken', 80],
    ['ปลาทอดกระเทียม', 'Fried Fish with Garlic', 150],
    ['ยำวุ้นเส้น', 'Glass Noodle Salad', 90],
    ['ส้มตำไทย', 'Thai Papaya Salad', 60],
    ['หมูทอดกระเทียม', 'Fried Pork with Garlic', 90]
  ]],
  ['เครื่องดื่ม', [
    ['น้ำเปล่า', 'Drinking Water', 10],
    ['ชาไทยเย็น', 'Thai Iced Tea', 35],
    ['กาแฟเย็น', 'Iced Coffee', 40],
    ['น้ำมะนาวโซดา', 'Lemon Soda', 35],
    ['น้ำส้มคั้น', 'Fresh Orange Juice', 45]
  ]],
  ['ของหวาน', [
    ['ข้าวเหนียวมะม่วง', 'Mango Sticky Rice', 90],
    ['บัวลอย', 'Bua Loy', 50],
    ['ไอศกรีมกะทิ', 'Coconut Ice Cream', 45],
    ['ทับทิมกรอบ', 'Tub Tim Grob', 45],
    ['เฉาก๊วยนมสด', 'Grass Jelly with Fresh Milk', 40]
  ]],

];

export async function seed(db) {
  for (const [cat, items] of MENU) {
    const r = await db.runAsync('INSERT INTO categories (name) VALUES (?)', [cat]);
    for (const [nameTH, nameEN, baht] of items) {
      await db.runAsync(
        'INSERT INTO menu_items (category_id, name_th, name_en, price_satang) VALUES (?, ?, ?, ?)',
        [r.lastInsertRowId, nameTH, nameEN, baht * 100]
      );
    }
  }
  for (let i = 1; i <= 15; i++) {
    await db.runAsync('INSERT INTO dining_tables (label) VALUES (?)', [String(i)]);
  }
}

export async function backfillEnglishMenuNames(db) {
  for (const [categoryName, items] of MENU) {
    const category = await db.getFirstAsync('SELECT id FROM categories WHERE name = ?', [categoryName]);
    if (!category) continue;
    for (const [nameTH, nameEN] of items) {
      await db.runAsync(
        'UPDATE menu_items SET name_en = ? WHERE category_id = ? AND name_th = ?',
        [nameEN, category.id, nameTH]
      );
    }
  }
}
