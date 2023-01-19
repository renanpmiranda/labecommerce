-- Active: 1673888150880@@127.0.0.1@3306
CREATE TABLE purchases (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    total_price REAL UNIQUE NOT NULL,
    paid INTEGER NOT NULL,
    delivered_at TEXT,
    buyer_id TEXT NOT NULL,
    FOREIGN KEY (buyer_id) REFERENCES users(id)
);

INSERT INTO purchases (id, total_price, paid, buyer_id)
VALUES
    ("c001", 350.00, 0, "001"),
    ("c002", 2700.00, 0, "001"),
    ("c003", 5499.99, 0, "002"),
    ("c004", 549.99, 0, "002"),
    ("c005", 199.99, 0, "003");

SELECT * FROM purchases;

DROP TABLE purchases;