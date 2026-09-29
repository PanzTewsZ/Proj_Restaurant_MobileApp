PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS categories (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS menu_items (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id  INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  name         TEXT NOT NULL,
  price_satang INTEGER NOT NULL CHECK (price_satang >= 0),
  is_available INTEGER NOT NULL DEFAULT 1 CHECK (is_available IN (0,1))
);
CREATE TABLE IF NOT EXISTS dining_tables (
  id    INTEGER PRIMARY KEY AUTOINCREMENT,
  label TEXT NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS bills (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  table_id  INTEGER NOT NULL REFERENCES dining_tables(id) ON DELETE RESTRICT,
  status    TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','closed')),
  opened_at TEXT NOT NULL,
  closed_at TEXT
);
CREATE TABLE IF NOT EXISTS orders (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  bill_id    INTEGER NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
  round_no   INTEGER NOT NULL CHECK (round_no >= 1),
  created_at TEXT NOT NULL,
  UNIQUE (bill_id, round_no)
);
CREATE TABLE IF NOT EXISTS order_items (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id          INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id      INTEGER REFERENCES menu_items(id) ON DELETE SET NULL,
  item_name         TEXT NOT NULL,
  unit_price_satang INTEGER NOT NULL CHECK (unit_price_satang >= 0),
  qty               INTEGER NOT NULL CHECK (qty > 0),
  note              TEXT,
  status            TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending','cooking','served','cancelled')),
  cancelled_at      TEXT
);

-- 1 โต๊ะมีบิลเปิดได้ใบเดียว
CREATE UNIQUE INDEX IF NOT EXISTS ux_open_bill_per_table ON bills(table_id) WHERE status = 'open';
CREATE INDEX IF NOT EXISTS idx_orders_bill        ON orders(bill_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order  ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_status ON order_items(status);
