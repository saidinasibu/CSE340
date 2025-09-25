
DROP TYPE IF EXISTS account_type CASCADE;

CREATE TYPE account_type AS ENUM ('Customer', 'Admin', 'Employee');

DROP TABLE IF EXISTS account CASCADE;
CREATE TABLE account (
  account_id   SERIAL PRIMARY KEY,
  first_name   VARCHAR(100) NOT NULL,
  last_name    VARCHAR(100) NOT NULL,
  account_email VARCHAR(255) UNIQUE NOT NULL,
  account_password VARCHAR(255) NOT NULL,
  account_type account_type NOT NULL DEFAULT 'Customer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

DROP TABLE IF EXISTS classification CASCADE;
CREATE TABLE classification (
  classification_id SERIAL PRIMARY KEY,
  classification_name VARCHAR(100) UNIQUE NOT NULL,
  classification_description TEXT
);

DROP TABLE IF EXISTS inventory CASCADE;
CREATE TABLE inventory (
  inv_id SERIAL PRIMARY KEY,
  make VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  inv_description TEXT,
  classification_id INTEGER REFERENCES classification(classification_id) ON DELETE SET NULL,
  inv_image VARCHAR(500),
  inv_thumbnail VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

INSERT INTO classification (classification_name, classification_description) VALUES
('Economy', 'Petites berlines et citadines'),
('Sport', 'Véhicules de catégorie sport et performance'),
('Truck', 'Camions et utilitaires'),
('Luxury', 'Véhicules de luxe');

INSERT INTO inventory (make, model, inv_description, classification_id, inv_image, inv_thumbnail)
VALUES
('GM', 'Hummer', 'Robust offroad vehicle with small interiors and strong chassis', 3, '/images/hummer.jpg', '/images/hummer-thumb.jpg'),
('Porsche', '911', 'Classic sport car - high performance and sleek design', 2, '/images/porsche-911.jpg', '/images/porsche-911-thumb.jpg'),
('Mazda', 'RX-7', 'Lightweight sport car with rotary engine', 2, '/images/mazda-rx7.jpg', '/images/mazda-rx7-thumb.jpg'),
('Toyota', 'Corolla', 'Reliable economy sedan', 1, '/images/toyota-corolla.jpg', '/images/toyota-corolla-thumb.jpg'),
('Ford', 'F-150', 'Popular light truck', 3, '/images/ford-f150.jpg', '/images/ford-f150-thumb.jpg');

INSERT INTO account (first_name, last_name, account_email, account_password, account_type)
VALUES
('Alice','Dupont','alice@example.com','password123','Customer'),
('Bob','Martin','bob@example.com','password456','Employee');

UPDATE inventory
SET inv_description = replace(inv_description, 'small interiors', 'a huge interior')
WHERE make = 'GM' AND model = 'Hummer';

UPDATE inventory
SET inv_image = replace(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = replace(inv_thumbnail, '/images/', '/images/vehicles/');
