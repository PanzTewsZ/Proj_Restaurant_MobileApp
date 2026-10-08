import { SCHEMA_SQL } from './schema';
import { backfillEnglishMenuNames, seed } from './seed';

// ชื่อไฟล์ไม่ซ้ำโปรเจกต์อื่นในเครื่อง
export const DB_NAME = 'restaurant_order_ku_kps.db';
const DB_VERSION = 2;

// ใช้เป็น onInit ของ SQLiteProvider: สร้างหรืออัปเกรดฐานข้อมูลตาม PRAGMA user_version
export async function initDatabase(db) {
  await db.execAsync('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
  const row = await db.getFirstAsync('PRAGMA user_version');
  if (row.user_version >= DB_VERSION) return;
  await db.withExclusiveTransactionAsync(async (tx) => {
    if (row.user_version === 0) {
      await tx.execAsync(SCHEMA_SQL);
      await seed(tx);
    } else if (row.user_version === 1) {
      await tx.execAsync(
        `ALTER TABLE menu_items ADD COLUMN name_th TEXT NOT NULL DEFAULT '';
         ALTER TABLE menu_items ADD COLUMN name_en TEXT NOT NULL DEFAULT '';
         UPDATE menu_items SET name_th = name;`
      );
      await backfillEnglishMenuNames(tx);
    } else {
      throw new Error(`Unsupported database version: ${row.user_version}`);
    }
  });
  await db.execAsync(`PRAGMA user_version = ${DB_VERSION}`); // ค่าคงที่ในโค้ด ไม่ใช่ input ผู้ใช้
}
