-- Active: 1673888150880@@127.0.0.1@3306

CREATE TABLE users (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL, 
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TEXT NOT NULL
);

PRAGMA table_info ("users");

INSERT INTO users (id, name, email, password, created_at)
VALUES ("u001", "Fulano", "fulano@gmail.com", "123456", DATETIME("now", "localtime")),
("u002", "Ciclano", "ciclano@gmail.com", "654321", DATETIME("now", "localtime")),
("u003", "Beltrano", "beltrano@gmail.com", "112233445566", DATETIME("now", "localtime"));

SELECT * FROM users;

DROP TABLE users;

-- GET ALL USERS
SELECT * FROM users
ORDER BY email ASC;

-- CREATE USER
INSERT INTO users (id, email, password)
VALUES ("004", "timpano@gmail.com", "02468");

-- EDIT USER BY ID
UPDATE users
SET password = "02468"
WHERE id = "003";

-- DELETE USER BY ID
DELETE FROM users
WHERE id = "004";