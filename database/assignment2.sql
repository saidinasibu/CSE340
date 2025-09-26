-- 1. Insert Tony Stark
INSERT INTO account (first_name, last_name, account_email, account_password)
VALUES ('Tony','Stark','tony@starkent.com','Iam1ronM@n');

-- 2. Update Tony Stark to Admin
UPDATE account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';

-- 3. Delete Tony Stark
DELETE FROM account
WHERE account_email = 'tony@starkent.com';

-- 4. Update GM Hummer description with REPLACE
UPDATE inventory
SET inv_description = replace(inv_description, 'small interiors', 'a huge interior')
WHERE make = 'GM' AND model = 'Hummer';

-- 5. INNER JOIN Sport items
SELECT i.make, i.model, c.classification_name
FROM inventory i
JOIN classification c ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';

-- 6. Update images paths to add "/vehicles"
UPDATE inventory
SET inv_image = replace(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = replace(inv_thumbnail, '/images/', '/images/vehicles/');
