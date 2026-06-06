-- =============================================
-- Seed data for VendorBridge
-- Runs on application startup
-- All passwords are: password123
-- BCrypt hash: $2a$10$dXJ3SW6G7P50lGmMQgel2e1BxKv6Mx9Z0n4Gz2hW0O1J5jGH1tOkq
-- =============================================

-- =============================================
-- USERS (4 roles for demo)
-- =============================================

-- Admin
INSERT IGNORE INTO users (id, first_name, last_name, email, password, phone, role, country, is_active, created_at)
VALUES (1, 'Vrushti', 'Admin', 'admin@vendorbridge.com',
        '$2a$10$dXJ3SW6G7P50lGmMQgel2e1BxKv6Mx9Z0n4Gz2hW0O1J5jGH1tOkq',
        '9876543210', 'ADMIN', 'India', true, NOW());

-- Procurement Officers
INSERT IGNORE INTO users (id, first_name, last_name, email, password, phone, role, country, is_active, created_at)
VALUES (2, 'Rahul', 'Sharma', 'rahul@vendorbridge.com',
        '$2a$10$dXJ3SW6G7P50lGmMQgel2e1BxKv6Mx9Z0n4Gz2hW0O1J5jGH1tOkq',
        '9876543211', 'PROCUREMENT_OFFICER', 'India', true, NOW());

INSERT IGNORE INTO users (id, first_name, last_name, email, password, phone, role, country, is_active, created_at)
VALUES (3, 'Priya', 'Patel', 'priya@vendorbridge.com',
        '$2a$10$dXJ3SW6G7P50lGmMQgel2e1BxKv6Mx9Z0n4Gz2hW0O1J5jGH1tOkq',
        '9876543212', 'PROCUREMENT_OFFICER', 'India', true, NOW());

-- Managers
INSERT IGNORE INTO users (id, first_name, last_name, email, password, phone, role, country, is_active, created_at)
VALUES (4, 'Ankit', 'Mehta', 'ankit@vendorbridge.com',
        '$2a$10$dXJ3SW6G7P50lGmMQgel2e1BxKv6Mx9Z0n4Gz2hW0O1J5jGH1tOkq',
        '9876543213', 'MANAGER', 'India', true, NOW());

INSERT IGNORE INTO users (id, first_name, last_name, email, password, phone, role, country, is_active, created_at)
VALUES (5, 'Sneha', 'Desai', 'sneha@vendorbridge.com',
        '$2a$10$dXJ3SW6G7P50lGmMQgel2e1BxKv6Mx9Z0n4Gz2hW0O1J5jGH1tOkq',
        '9876543214', 'MANAGER', 'India', true, NOW());

-- Vendor Users
INSERT IGNORE INTO users (id, first_name, last_name, email, password, phone, role, country, is_active, created_at)
VALUES (6, 'Amit', 'Kumar', 'amit@techsupply.com',
        '$2a$10$dXJ3SW6G7P50lGmMQgel2e1BxKv6Mx9Z0n4Gz2hW0O1J5jGH1tOkq',
        '9876543215', 'VENDOR', 'India', true, NOW());

INSERT IGNORE INTO users (id, first_name, last_name, email, password, phone, role, country, is_active, created_at)
VALUES (7, 'Kavita', 'Singh', 'kavita@industrialparts.com',
        '$2a$10$dXJ3SW6G7P50lGmMQgel2e1BxKv6Mx9Z0n4Gz2hW0O1J5jGH1tOkq',
        '9876543216', 'VENDOR', 'India', true, NOW());

INSERT IGNORE INTO users (id, first_name, last_name, email, password, phone, role, country, is_active, created_at)
VALUES (8, 'Rajesh', 'Gupta', 'rajesh@globalmaterials.com',
        '$2a$10$dXJ3SW6G7P50lGmMQgel2e1BxKv6Mx9Z0n4Gz2hW0O1J5jGH1tOkq',
        '9876543217', 'VENDOR', 'India', true, NOW());

-- =============================================
-- CATEGORIES
-- =============================================
INSERT IGNORE INTO categories (id, name, description) VALUES
(1, 'Electronics', 'Electronic components, circuits, and devices'),
(2, 'Raw Materials', 'Steel, aluminum, chemicals, and industrial raw materials'),
(3, 'Office Supplies', 'Stationery, furniture, and office consumables'),
(4, 'IT Services', 'Software licenses, cloud infrastructure, and IT consulting'),
(5, 'Logistics', 'Transportation, warehousing, and freight services'),
(6, 'Packaging', 'Boxes, wrapping materials, and packaging solutions'),
(7, 'Safety Equipment', 'PPE kits, helmets, gloves, and safety gear'),
(8, 'Electrical', 'Wiring, transformers, switchgear, and electrical supplies');
