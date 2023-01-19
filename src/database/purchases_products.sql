-- Active: 1673888150880@@127.0.0.1@3306

CREATE TABLE purchases_products(
    purchase_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (purchase_id) REFERENCES purchases(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT INTO purchases_products (purchase_id, product_id, quantity)
VALUES
    ("c001", "p003", 1),
    ("c002", "p004", 1),
    ("c003", "p002", 1),
    ("c004", "p005", 1),
    ("c005", "p001", 1);

SELECT * FROM purchases_products;

DROP TABLE purchases_products;

SELECT * FROM purchases_products
INNER JOIN purchases
ON purchases_products.purchase_id = purchases.id
INNER JOIN products
ON purchases_products.product_id = products.id;