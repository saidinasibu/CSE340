-- 1. Create account_type ENUM
DROP TYPE IF EXISTS public.account_type CASCADE;
CREATE TYPE public.account_type AS ENUM ('Customer', 'Employee', 'Admin');

-- 2. Table structure for 'classification'
DROP TABLE IF EXISTS public.classification CASCADE;
CREATE TABLE public.classification (
    classification_id SERIAL PRIMARY KEY,
    classification_name VARCHAR(100) UNIQUE NOT NULL,
    classification_description TEXT
);

-- 3. Table structure for 'inventory'
DROP TABLE IF EXISTS public.inventory CASCADE;
CREATE TABLE public.inventory (
    inv_id SERIAL PRIMARY KEY,
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    inv_description TEXT,
    classification_id INTEGER REFERENCES classification(classification_id) ON DELETE SET NULL,
    inv_image VARCHAR(500),
    inv_thumbnail VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Table structure for 'account'
DROP TABLE IF EXISTS public.account CASCADE;
CREATE TABLE public.account (
  account_id   SERIAL PRIMARY KEY,
  first_name   VARCHAR(100) NOT NULL,
  last_name    VARCHAR(100) NOT NULL,
  account_email VARCHAR(255) UNIQUE NOT NULL,
  account_password VARCHAR(255) NOT NULL,
  account_type account_type NOT NULL DEFAULT 'Customer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. Insert data into 'classification'
INSERT INTO classification (classification_name, classification_description) VALUES
('Economy', 'Petites berlines et citadines'),
('Sport', 'Véhicules de catégorie sport et performance'),
('Truck', 'Camions et utilitaires'),
('Luxury', 'Véhicules de luxe');

-- 6. Insert data into 'inventory'
INSERT INTO inventory (make, model, inv_description, classification_id, inv_image, inv_thumbnail)
VALUES
('GM', 'Hummer', 'Robust offroad vehicle with small interiors and strong chassis', 3, '/images/hummer.jpg', '/images/hummer-thumb.jpg'),
('Porsche', '911', 'Classic sport car - high performance and sleek design', 2, '/images/porsche-911.jpg', '/images/porsche-911-thumb.jpg'),
('Mazda', 'RX-7', 'Lightweight sport car with rotary engine', 2, '/images/mazda-rx7.jpg', '/images/mazda-rx7-thumb.jpg'),
('Toyota', 'Corolla', 'Reliable economy sedan', 1, '/images/toyota-corolla.jpg', '/images/toyota-corolla-thumb.jpg'),
('Ford', 'F-150', 'Popular light truck', 3, '/images/ford-f150.jpg', '/images/ford-f150-thumb.jpg');

-- 7. Copy of query 4 from assignment2.sql (update GM Hummer description)
UPDATE inventory
SET inv_description = replace(inv_description, 'small interiors', 'a huge interior')
WHERE make = 'GM' AND model = 'Hummer';

-- 8. Copy of query 6 from assignment2.sql (update images paths)
UPDATE inventory
SET inv_image = replace(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = replace(inv_thumbnail, '/images/', '/images/vehicles/');
