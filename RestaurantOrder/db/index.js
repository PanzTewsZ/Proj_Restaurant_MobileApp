import { SCHEMA_SQL } from './schema';
import { seed } from './seed';

// ชื่อไฟล์ไม่ซ้ำโปรเจกต์อื่นในเครื่อง
export const DB_NAME = 'restaurant_order_ku_kps.db';
const DB_VERSION = 1;

// ใช้เป็น onInit ของ SQLiteProvider: สร้างตาราง + seed เฉพาะครั้งแรก (คุมด้วย PRAGMA user_version)
export async function initDatabase(db) {
  await db.execAsync('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
  const row = await db.getFirstAsync('PRAGMA user_version');
  if (row.user_version >= DB_VERSION) return;
  await db.withExclusiveTransactionAsync(async (tx) => {
    await tx.execAsync(SCHEMA_SQL);
    await seed(tx);
  });
  await db.execAsync(`PRAGMA user_version = ${DB_VERSION}`); // ค่าคงที่ในโค้ด ไม่ใช่ input ผู้ใช้
}
