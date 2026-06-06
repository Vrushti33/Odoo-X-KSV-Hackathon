-- =============================================
-- Seed data for VendorBridge
-- Runs on application startup
-- All passwords are: password123
-- Verified BCrypt hash: $2a$10$psm/imexwvXlHmI55Z7RBejCl1Re5yPTxK1.d7WBz7FCeRDvBs1ym
-- =============================================

-- =============================================
-- USERS
-- =============================================

-- Admin (1)
INSERT IGNORE INTO users (id, first_name, last_name, email, password, phone, role, country, is_active, created_at)
VALUES (1, 'Vrushti', 'Admin', 'admin@vendorbridge.com',
        '$2a$10$psm/imexwvXlHmI55Z7RBejCl1Re5yPTxK1.d7WBz7FCeRDvBs1ym',
        '9876543210', 'ADMIN', 'India', true, NOW());

-- Procurement Officers (2, 3, 9)
INSERT IGNORE INTO users (id, first_name, last_name, email, password, phone, role, country, is_active, created_at)
VALUES (2, 'Rahul', 'Sharma', 'rahul@vendorbridge.com',
        '$2a$10$psm/imexwvXlHmI55Z7RBejCl1Re5yPTxK1.d7WBz7FCeRDvBs1ym',
        '9876543211', 'PROCUREMENT_OFFICER', 'India', true, NOW());

INSERT IGNORE INTO users (id, first_name, last_name, email, password, phone, role, country, is_active, created_at)
VALUES (3, 'Priya', 'Patel', 'priya@vendorbridge.com',
        '$2a$10$psm/imexwvXlHmI55Z7RBejCl1Re5yPTxK1.d7WBz7FCeRDvBs1ym',
        '9876543212', 'PROCUREMENT_OFFICER', 'India', true, NOW());

INSERT IGNORE INTO users (id, first_name, last_name, email, password, phone, role, country, is_active, created_at)
VALUES (9, 'Vikram', 'Singh', 'vikram@vendorbridge.com',
        '$2a$10$psm/imexwvXlHmI55Z7RBejCl1Re5yPTxK1.d7WBz7FCeRDvBs1ym',
        '9876543218', 'PROCUREMENT_OFFICER', 'India', true, NOW());

-- Managers (4, 5, 10)
INSERT IGNORE INTO users (id, first_name, last_name, email, password, phone, role, country, is_active, created_at)
VALUES (4, 'Ankit', 'Mehta', 'ankit@vendorbridge.com',
        '$2a$10$psm/imexwvXlHmI55Z7RBejCl1Re5yPTxK1.d7WBz7FCeRDvBs1ym',
        '9876543213', 'MANAGER', 'India', true, NOW());

INSERT IGNORE INTO users (id, first_name, last_name, email, password, phone, role, country, is_active, created_at)
VALUES (5, 'Sneha', 'Desai', 'sneha@vendorbridge.com',
        '$2a$10$psm/imexwvXlHmI55Z7RBejCl1Re5yPTxK1.d7WBz7FCeRDvBs1ym',
        '9876543214', 'MANAGER', 'India', true, NOW());

INSERT IGNORE INTO users (id, first_name, last_name, email, password, phone, role, country, is_active, created_at)
VALUES (10, 'Neha', 'Sharma', 'neha@vendorbridge.com',
        '$2a$10$psm/imexwvXlHmI55Z7RBejCl1Re5yPTxK1.d7WBz7FCeRDvBs1ym',
        '9876543219', 'MANAGER', 'India', true, NOW());

-- Vendor Users (6, 7, 8, 11)
INSERT IGNORE INTO users (id, first_name, last_name, email, password, phone, role, country, is_active, created_at)
VALUES (6, 'Amit', 'Kumar', 'amit@techsupply.com',
        '$2a$10$psm/imexwvXlHmI55Z7RBejCl1Re5yPTxK1.d7WBz7FCeRDvBs1ym',
        '9876543215', 'VENDOR', 'India', true, NOW());

INSERT IGNORE INTO users (id, first_name, last_name, email, password, phone, role, country, is_active, created_at)
VALUES (7, 'Kavita', 'Singh', 'kavita@industrialparts.com',
        '$2a$10$psm/imexwvXlHmI55Z7RBejCl1Re5yPTxK1.d7WBz7FCeRDvBs1ym',
        '9876543216', 'VENDOR', 'India', true, NOW());

INSERT IGNORE INTO users (id, first_name, last_name, email, password, phone, role, country, is_active, created_at)
VALUES (8, 'Rajesh', 'Gupta', 'rajesh@globalmaterials.com',
        '$2a$10$psm/imexwvXlHmI55Z7RBejCl1Re5yPTxK1.d7WBz7FCeRDvBs1ym',
        '9876543217', 'VENDOR', 'India', true, NOW());

INSERT IGNORE INTO users (id, first_name, last_name, email, password, phone, role, country, is_active, created_at)
VALUES (11, 'Suresh', 'Patel', 'suresh@industrialparts.com',
        '$2a$10$psm/imexwvXlHmI55Z7RBejCl1Re5yPTxK1.d7WBz7FCeRDvBs1ym',
        '9876543220', 'VENDOR', 'India', true, NOW());

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

-- =============================================
-- VENDORS (linked to users 6, 7, 8, 11)
-- =============================================
INSERT IGNORE INTO vendors (id, user_id, company_name, contact_person, email, phone, gst_number, address, city, state, country, pincode, status, rating, created_at)
VALUES (1, 6, 'Tech Supply Solutions', 'Amit Kumar', 'amit@techsupply.com', '9876543215', '22AAAAA1111A1Z1', '123 Tech Park', 'Bangalore', 'Karnataka', 'India', '560001', 'ACTIVE', 4.50, NOW());

INSERT IGNORE INTO vendors (id, user_id, company_name, contact_person, email, phone, gst_number, address, city, state, country, pincode, status, rating, created_at)
VALUES (2, 7, 'Industrial Parts Co', 'Kavita Singh', 'kavita@industrialparts.com', '9876543216', '22BBBBB2222B2Z2', '456 Industrial Area', 'Pune', 'Maharashtra', 'India', '411001', 'ACTIVE', 4.20, NOW());

INSERT IGNORE INTO vendors (id, user_id, company_name, contact_person, email, phone, gst_number, address, city, state, country, pincode, status, rating, created_at)
VALUES (3, 8, 'Global Materials Ltd', 'Rajesh Gupta', 'rajesh@globalmaterials.com', '9876543217', '22CCCCC3333C3Z3', '789 Trade Tower', 'Mumbai', 'Maharashtra', 'India', '400001', 'ACTIVE', 3.80, NOW());

INSERT IGNORE INTO vendors (id, user_id, company_name, contact_person, email, phone, gst_number, address, city, state, country, pincode, status, rating, created_at)
VALUES (4, 11, 'Suresh Components Ltd', 'Suresh Patel', 'suresh@industrialparts.com', '9876543220', '22DDDDD4444D4Z4', '101 Industrial Lane', 'Ahmedabad', 'Gujarat', 'India', '380001', 'ACTIVE', 4.00, NOW());

-- =============================================
-- VENDOR CATEGORIES (junction table mapping)
-- =============================================
INSERT IGNORE INTO vendor_categories (vendor_id, category_id) VALUES (1, 1);
INSERT IGNORE INTO vendor_categories (vendor_id, category_id) VALUES (2, 2);
INSERT IGNORE INTO vendor_categories (vendor_id, category_id) VALUES (3, 2);
INSERT IGNORE INTO vendor_categories (vendor_id, category_id) VALUES (4, 2);

-- =============================================
-- RFQ SEED DATA
-- =============================================
INSERT IGNORE INTO rfq (id, rfq_number, title, description, category_id, created_by, status, deadline, budget, created_at)
VALUES (1, 'RFQ-20260606-0001', 'Office IT Equipment Upgrade', 'Request for new developer laptops and accessories.', 1, 2, 'PUBLISHED', '2026-06-30', 75000.00, NOW());

INSERT IGNORE INTO rfq (id, rfq_number, title, description, category_id, created_by, status, deadline, budget, created_at)
VALUES (2, 'RFQ-20260606-0002', 'High-grade Aluminum Sheets', 'Aluminum raw material order for manufacturing division.', 2, 3, 'PUBLISHED', '2026-07-15', 120000.00, NOW());

-- =============================================
-- RFQ ITEMS SEED DATA
-- =============================================
INSERT IGNORE INTO rfq_items (id, rfq_id, item_name, description, quantity, unit, estimated_price)
VALUES (1, 1, 'Developer Laptops', 'Intel i7, 32GB RAM, 1TB SSD', 10, 'pcs', 1200.00);

INSERT IGNORE INTO rfq_items (id, rfq_id, item_name, description, quantity, unit, estimated_price)
VALUES (2, 1, '4K Monitors', '27-inch IPS displays', 15, 'pcs', 300.00);

INSERT IGNORE INTO rfq_items (id, rfq_id, item_name, description, quantity, unit, estimated_price)
VALUES (3, 2, 'Aluminum Sheets 10x10', 'Grade 6061-T6', 500, 'pcs', 200.00);

-- =============================================
-- RFQ VENDORS SEED DATA
-- =============================================
INSERT IGNORE INTO rfq_vendors (id, rfq_id, vendor_id, invited_at, status)
VALUES (1, 1, 1, NOW(), 'QUOTED');

INSERT IGNORE INTO rfq_vendors (id, rfq_id, vendor_id, invited_at, status)
VALUES (2, 2, 2, NOW(), 'QUOTED');

INSERT IGNORE INTO rfq_vendors (id, rfq_id, vendor_id, invited_at, status)
VALUES (3, 2, 3, NOW(), 'QUOTED');

-- =============================================
-- ADDITIONAL RFQs (3, 4, 5)
-- =============================================
INSERT IGNORE INTO rfq (id, rfq_number, title, description, category_id, created_by, status, deadline, budget, created_at)
VALUES (3, 'RFQ-20260601-0003', 'Safety Equipment for Factory Floor', 'PPE kits, helmets, safety goggles, and fire-resistant gloves for 200+ workers.', 7, 2, 'CLOSED', '2026-06-20', 45000.00, '2026-06-01 09:00:00');

INSERT IGNORE INTO rfq (id, rfq_number, title, description, category_id, created_by, status, deadline, budget, created_at)
VALUES (4, 'RFQ-20260603-0004', 'Quarterly Office Stationery Supply', 'Notebooks, pens, printer cartridges, A4 paper, and filing supplies.', 3, 3, 'PUBLISHED', '2026-07-10', 15000.00, '2026-06-03 11:30:00');

INSERT IGNORE INTO rfq (id, rfq_number, title, description, category_id, created_by, status, deadline, budget, created_at)
VALUES (5, 'RFQ-20260605-0005', 'Electrical Wiring & Switchgear', 'Industrial-grade copper wiring, circuit breakers, and switchgear panels.', 8, 9, 'PUBLISHED', '2026-07-20', 200000.00, '2026-06-05 14:00:00');

-- Additional RFQ items
INSERT IGNORE INTO rfq_items (id, rfq_id, item_name, description, quantity, unit, estimated_price)
VALUES (4, 3, 'PPE Safety Kits', 'Full body PPE kit with coverall, goggles, gloves', 200, 'kits', 85.00);

INSERT IGNORE INTO rfq_items (id, rfq_id, item_name, description, quantity, unit, estimated_price)
VALUES (5, 3, 'Industrial Helmets', 'ISI-certified hard hats with chin strap', 250, 'pcs', 25.00);

INSERT IGNORE INTO rfq_items (id, rfq_id, item_name, description, quantity, unit, estimated_price)
VALUES (6, 4, 'A4 Paper Reams', '80 GSM white copier paper', 500, 'reams', 5.50);

INSERT IGNORE INTO rfq_items (id, rfq_id, item_name, description, quantity, unit, estimated_price)
VALUES (7, 4, 'Ink Cartridges HP 61', 'Original HP 61XL black + color combo', 50, 'pcs', 35.00);

INSERT IGNORE INTO rfq_items (id, rfq_id, item_name, description, quantity, unit, estimated_price)
VALUES (8, 5, 'Copper Wiring 4mm', '4mm multi-strand copper wire, 100m rolls', 300, 'rolls', 120.00);

INSERT IGNORE INTO rfq_items (id, rfq_id, item_name, description, quantity, unit, estimated_price)
VALUES (9, 5, 'Circuit Breaker 63A', 'Triple-pole MCB 63A rated', 100, 'pcs', 180.00);

-- Additional RFQ vendor invitations
INSERT IGNORE INTO rfq_vendors (id, rfq_id, vendor_id, invited_at, status)
VALUES (4, 3, 3, '2026-06-01 10:00:00', 'QUOTED');

INSERT IGNORE INTO rfq_vendors (id, rfq_id, vendor_id, invited_at, status)
VALUES (5, 3, 4, '2026-06-01 10:00:00', 'QUOTED');

INSERT IGNORE INTO rfq_vendors (id, rfq_id, vendor_id, invited_at, status)
VALUES (6, 4, 2, NOW(), 'INVITED');

INSERT IGNORE INTO rfq_vendors (id, rfq_id, vendor_id, invited_at, status)
VALUES (7, 4, 4, NOW(), 'INVITED');

INSERT IGNORE INTO rfq_vendors (id, rfq_id, vendor_id, invited_at, status)
VALUES (8, 5, 1, NOW(), 'INVITED');

INSERT IGNORE INTO rfq_vendors (id, rfq_id, vendor_id, invited_at, status)
VALUES (9, 5, 3, NOW(), 'INVITED');

-- =============================================
-- QUOTATIONS
-- =============================================
-- Quotation 1: Vendor 1 (Tech Supply) responds to RFQ 1 (IT Equipment) — ACCEPTED
INSERT IGNORE INTO quotations (id, rfq_id, vendor_id, quotation_number, subtotal, tax_percentage, tax_amount, discount_percentage, discount_amount, grand_total, delivery_days, notes, validity_days, status, submitted_at, created_at)
VALUES (1, 1, 1, 'QTN-20260606-0001', 16500.00, 18.00, 2970.00, 5.00, 825.00, 18645.00, 14, 'We offer premium Dell laptops and LG monitors. 1-year warranty included.', 30, 'ACCEPTED', '2026-06-07 10:00:00', '2026-06-06 15:00:00');

-- Quotation 2: Vendor 2 (Industrial Parts) responds to RFQ 2 (Aluminum) — SUBMITTED
INSERT IGNORE INTO quotations (id, rfq_id, vendor_id, quotation_number, subtotal, tax_percentage, tax_amount, discount_percentage, discount_amount, grand_total, delivery_days, notes, validity_days, status, submitted_at, created_at)
VALUES (2, 2, 2, 'QTN-20260607-0002', 95000.00, 18.00, 17100.00, 3.00, 2850.00, 109250.00, 21, 'Grade 6061-T6 aluminum sheets sourced from Hindalco. Bulk discount applied.', 30, 'SUBMITTED', '2026-06-08 09:00:00', '2026-06-07 14:00:00');

-- Quotation 3: Vendor 3 (Global Materials) also responds to RFQ 2 (Aluminum) — REJECTED
INSERT IGNORE INTO quotations (id, rfq_id, vendor_id, quotation_number, subtotal, tax_percentage, tax_amount, discount_percentage, discount_amount, grand_total, delivery_days, notes, validity_days, status, submitted_at, created_at)
VALUES (3, 2, 3, 'QTN-20260607-0003', 105000.00, 18.00, 18900.00, 0.00, 0.00, 123900.00, 30, 'Standard grade aluminum. Delivery within 30 days.', 30, 'REJECTED', '2026-06-08 11:00:00', '2026-06-07 16:00:00');

-- Quotation 4: Vendor 3 (Global Materials) responds to RFQ 3 (Safety) — ACCEPTED
INSERT IGNORE INTO quotations (id, rfq_id, vendor_id, quotation_number, subtotal, tax_percentage, tax_amount, discount_percentage, discount_amount, grand_total, delivery_days, notes, validity_days, status, submitted_at, created_at)
VALUES (4, 3, 3, 'QTN-20260602-0004', 23250.00, 12.00, 2790.00, 2.00, 465.00, 25575.00, 10, 'BIS-certified safety gear. Express delivery available.', 30, 'ACCEPTED', '2026-06-02 15:00:00', '2026-06-02 09:00:00');

-- Quotation 5: Vendor 4 (Suresh Components) responds to RFQ 3 (Safety) — SUBMITTED
INSERT IGNORE INTO quotations (id, rfq_id, vendor_id, quotation_number, subtotal, tax_percentage, tax_amount, discount_percentage, discount_amount, grand_total, delivery_days, notes, validity_days, status, submitted_at, created_at)
VALUES (5, 3, 4, 'QTN-20260602-0005', 24500.00, 12.00, 2940.00, 0.00, 0.00, 27440.00, 15, 'Good quality safety kits with extended warranty.', 30, 'SUBMITTED', '2026-06-02 18:00:00', '2026-06-02 12:00:00');

-- =============================================
-- QUOTATION ITEMS
-- =============================================
-- Items for Quotation 1 (IT Equipment from Vendor 1)
INSERT IGNORE INTO quotation_items (id, quotation_id, rfq_item_id, item_name, quantity, unit_price, total_price)
VALUES (1, 1, 1, 'Developer Laptops — Dell Latitude 7440', 10, 1150.00, 11500.00);

INSERT IGNORE INTO quotation_items (id, quotation_id, rfq_item_id, item_name, quantity, unit_price, total_price)
VALUES (2, 1, 2, '4K Monitors — LG 27UK850-W', 15, 333.33, 5000.00);

-- Items for Quotation 2 (Aluminum from Vendor 2)
INSERT IGNORE INTO quotation_items (id, quotation_id, rfq_item_id, item_name, quantity, unit_price, total_price)
VALUES (3, 2, 3, 'Aluminum Sheets 10x10 Grade 6061-T6', 500, 190.00, 95000.00);

-- Items for Quotation 3 (Aluminum from Vendor 3)
INSERT IGNORE INTO quotation_items (id, quotation_id, rfq_item_id, item_name, quantity, unit_price, total_price)
VALUES (4, 3, 3, 'Aluminum Sheets 10x10 Standard Grade', 500, 210.00, 105000.00);

-- Items for Quotation 4 (Safety from Vendor 3)
INSERT IGNORE INTO quotation_items (id, quotation_id, rfq_item_id, item_name, quantity, unit_price, total_price)
VALUES (5, 4, 4, 'PPE Safety Kits — Full Body', 200, 80.00, 16000.00);

INSERT IGNORE INTO quotation_items (id, quotation_id, rfq_item_id, item_name, quantity, unit_price, total_price)
VALUES (6, 4, 5, 'Industrial Helmets — BIS Certified', 250, 29.00, 7250.00);

-- Items for Quotation 5 (Safety from Vendor 4)
INSERT IGNORE INTO quotation_items (id, quotation_id, rfq_item_id, item_name, quantity, unit_price, total_price)
VALUES (7, 5, 4, 'PPE Safety Kits — Standard', 200, 85.00, 17000.00);

INSERT IGNORE INTO quotation_items (id, quotation_id, rfq_item_id, item_name, quantity, unit_price, total_price)
VALUES (8, 5, 5, 'Hard Hats — Industrial Grade', 250, 30.00, 7500.00);

-- =============================================
-- APPROVALS
-- =============================================
-- Approval 1: Quotation 1 (IT Equipment) — APPROVED by Manager Ankit
INSERT IGNORE INTO approvals (id, rfq_id, quotation_id, requested_by, approved_by, status, remarks, step_order, requested_at, resolved_at)
VALUES (1, 1, 1, 2, 4, 'APPROVED', 'Competitive pricing with good warranty terms. Approved for PO generation.', 1, '2026-06-07 12:00:00', '2026-06-07 16:00:00');

-- Approval 2: Quotation 2 (Aluminum from Vendor 2) — PENDING review by Manager Sneha
INSERT IGNORE INTO approvals (id, rfq_id, quotation_id, requested_by, approved_by, status, remarks, step_order, requested_at, resolved_at)
VALUES (2, 2, 2, 3, NULL, 'PENDING', NULL, 1, '2026-06-08 10:00:00', NULL);

-- Approval 3: Quotation 3 (Aluminum from Vendor 3) — REJECTED by Manager Sneha
INSERT IGNORE INTO approvals (id, rfq_id, quotation_id, requested_by, approved_by, status, remarks, step_order, requested_at, resolved_at)
VALUES (3, 2, 3, 3, 5, 'REJECTED', 'Price is above budget and delivery timeline is too long. Rejected.', 1, '2026-06-08 12:00:00', '2026-06-08 15:00:00');

-- Approval 4: Quotation 4 (Safety from Vendor 3) — APPROVED by Manager Neha
INSERT IGNORE INTO approvals (id, rfq_id, quotation_id, requested_by, approved_by, status, remarks, step_order, requested_at, resolved_at)
VALUES (4, 3, 4, 2, 10, 'APPROVED', 'BIS-certified gear meets our compliance requirements. Fast delivery is a plus.', 1, '2026-06-03 09:00:00', '2026-06-03 14:00:00');

-- Approval 5: Quotation 5 (Safety from Vendor 4) — PENDING
INSERT IGNORE INTO approvals (id, rfq_id, quotation_id, requested_by, approved_by, status, remarks, step_order, requested_at, resolved_at)
VALUES (5, 3, 5, 2, NULL, 'PENDING', NULL, 1, '2026-06-03 10:00:00', NULL);

-- =============================================
-- PURCHASE ORDERS
-- =============================================
-- PO 1: From approved Quotation 1 (IT Equipment) — ISSUED
INSERT IGNORE INTO purchase_orders (id, po_number, rfq_id, quotation_id, vendor_id, created_by, subtotal, tax_amount, grand_total, status, po_date, delivery_date, created_at)
VALUES (1, 'PO-20260607-0001', 1, 1, 1, 2, 16500.00, 2970.00, 18645.00, 'ISSUED', '2026-06-07', '2026-06-21', '2026-06-07 17:00:00');

-- PO 2: From approved Quotation 4 (Safety Equipment) — COMPLETED
INSERT IGNORE INTO purchase_orders (id, po_number, rfq_id, quotation_id, vendor_id, created_by, subtotal, tax_amount, grand_total, status, po_date, delivery_date, created_at)
VALUES (2, 'PO-20260603-0002', 3, 4, 3, 2, 23250.00, 2790.00, 25575.00, 'COMPLETED', '2026-06-03', '2026-06-13', '2026-06-03 15:00:00');

-- =============================================
-- PO ITEMS
-- =============================================
-- PO 1 items (IT Equipment)
INSERT IGNORE INTO po_items (id, po_id, item_name, quantity, unit_price, total_price)
VALUES (1, 1, 'Developer Laptops — Dell Latitude 7440', 10, 1150.00, 11500.00);

INSERT IGNORE INTO po_items (id, po_id, item_name, quantity, unit_price, total_price)
VALUES (2, 1, '4K Monitors — LG 27UK850-W', 15, 333.33, 5000.00);

-- PO 2 items (Safety Equipment)
INSERT IGNORE INTO po_items (id, po_id, item_name, quantity, unit_price, total_price)
VALUES (3, 2, 'PPE Safety Kits — Full Body', 200, 80.00, 16000.00);

INSERT IGNORE INTO po_items (id, po_id, item_name, quantity, unit_price, total_price)
VALUES (4, 2, 'Industrial Helmets — BIS Certified', 250, 29.00, 7250.00);

-- =============================================
-- INVOICES
-- =============================================
-- Invoice 1: For PO 1 (IT Equipment) — PENDING_PAYMENT
INSERT IGNORE INTO invoices (id, invoice_number, po_id, vendor_id, created_by, subtotal, sgst, cgst, igst, grand_total, status, invoice_date, due_date, payment_status, created_at)
VALUES (1, 'INV-20260610-0001', 1, 1, 2, 16500.00, 1485.00, 1485.00, 0.00, 19470.00, 'PENDING_PAYMENT', '2026-06-10', '2026-06-25', 'UNPAID', '2026-06-10 10:00:00');

-- Invoice 2: For PO 2 (Safety Equipment) — PAID
INSERT IGNORE INTO invoices (id, invoice_number, po_id, vendor_id, created_by, subtotal, sgst, cgst, igst, grand_total, status, invoice_date, due_date, payment_status, created_at)
VALUES (2, 'INV-20260615-0002', 2, 3, 2, 23250.00, 1395.00, 1395.00, 0.00, 26040.00, 'PAID', '2026-06-15', '2026-06-30', 'PAID', '2026-06-15 11:00:00');

-- =============================================
-- INVOICE ITEMS
-- =============================================
-- Invoice 1 items (IT Equipment)
INSERT IGNORE INTO invoice_items (id, invoice_id, item_name, quantity, unit_price, total_price)
VALUES (1, 1, 'Developer Laptops — Dell Latitude 7440', 10, 1150.00, 11500.00);

INSERT IGNORE INTO invoice_items (id, invoice_id, item_name, quantity, unit_price, total_price)
VALUES (2, 1, '4K Monitors — LG 27UK850-W', 15, 333.33, 5000.00);

-- Invoice 2 items (Safety Equipment)
INSERT IGNORE INTO invoice_items (id, invoice_id, item_name, quantity, unit_price, total_price)
VALUES (3, 2, 'PPE Safety Kits — Full Body', 200, 80.00, 16000.00);

INSERT IGNORE INTO invoice_items (id, invoice_id, item_name, quantity, unit_price, total_price)
VALUES (4, 2, 'Industrial Helmets — BIS Certified', 250, 29.00, 7250.00);

-- =============================================
-- NOTIFICATIONS
-- =============================================
-- Vendor notifications — RFQ invitations
INSERT IGNORE INTO notifications (id, user_id, title, message, type, is_read, link, created_at)
VALUES (1, 6, 'New RFQ Invitation', 'You have been invited to submit a quotation for "Office IT Equipment Upgrade" (RFQ-20260606-0001).', 'RFQ', true, '/vendor/rfqs/1', '2026-06-06 10:05:00');

INSERT IGNORE INTO notifications (id, user_id, title, message, type, is_read, link, created_at)
VALUES (2, 7, 'New RFQ Invitation', 'You have been invited to submit a quotation for "High-grade Aluminum Sheets" (RFQ-20260606-0002).', 'RFQ', true, '/vendor/rfqs/2', '2026-06-06 10:10:00');

INSERT IGNORE INTO notifications (id, user_id, title, message, type, is_read, link, created_at)
VALUES (3, 8, 'New RFQ Invitation', 'You have been invited to submit a quotation for "High-grade Aluminum Sheets" (RFQ-20260606-0002).', 'RFQ', true, '/vendor/rfqs/2', '2026-06-06 10:10:00');

INSERT IGNORE INTO notifications (id, user_id, title, message, type, is_read, link, created_at)
VALUES (4, 8, 'New RFQ Invitation', 'You have been invited to submit a quotation for "Safety Equipment for Factory Floor" (RFQ-20260601-0003).', 'RFQ', false, '/vendor/rfqs/3', '2026-06-01 10:05:00');

INSERT IGNORE INTO notifications (id, user_id, title, message, type, is_read, link, created_at)
VALUES (5, 11, 'New RFQ Invitation', 'You have been invited to submit a quotation for "Safety Equipment for Factory Floor" (RFQ-20260601-0003).', 'RFQ', false, '/vendor/rfqs/3', '2026-06-01 10:05:00');

-- Procurement officer notifications — quotation submissions
INSERT IGNORE INTO notifications (id, user_id, title, message, type, is_read, link, created_at)
VALUES (6, 2, 'New Quotation Received', 'Tech Supply Solutions submitted quotation QTN-20260606-0001 for RFQ "Office IT Equipment Upgrade". Total: ₹18,645.00', 'QUOTATION', true, '/procurement/quotations/1', '2026-06-07 10:00:00');

INSERT IGNORE INTO notifications (id, user_id, title, message, type, is_read, link, created_at)
VALUES (7, 3, 'New Quotation Received', 'Industrial Parts Co submitted quotation QTN-20260607-0002 for RFQ "High-grade Aluminum Sheets". Total: ₹1,09,250.00', 'QUOTATION', true, '/procurement/quotations/2', '2026-06-08 09:00:00');

INSERT IGNORE INTO notifications (id, user_id, title, message, type, is_read, link, created_at)
VALUES (8, 3, 'New Quotation Received', 'Global Materials Ltd submitted quotation QTN-20260607-0003 for RFQ "High-grade Aluminum Sheets". Total: ₹1,23,900.00', 'QUOTATION', false, '/procurement/quotations/3', '2026-06-08 11:00:00');

-- Manager notifications — approval requests
INSERT IGNORE INTO notifications (id, user_id, title, message, type, is_read, link, created_at)
VALUES (9, 4, 'Approval Request', 'Rahul Sharma has requested approval for quotation QTN-20260606-0001 (IT Equipment). Please review.', 'APPROVAL', true, '/manager/approvals/1', '2026-06-07 12:00:00');

INSERT IGNORE INTO notifications (id, user_id, title, message, type, is_read, link, created_at)
VALUES (10, 5, 'Approval Request', 'Priya Patel has requested approval for quotation QTN-20260607-0002 (Aluminum). Please review.', 'APPROVAL', false, '/manager/approvals/2', '2026-06-08 10:00:00');

INSERT IGNORE INTO notifications (id, user_id, title, message, type, is_read, link, created_at)
VALUES (11, 10, 'Approval Request', 'Rahul Sharma has requested approval for quotation QTN-20260602-0004 (Safety Equipment). Please review.', 'APPROVAL', true, '/manager/approvals/4', '2026-06-03 09:00:00');

-- Vendor notifications — approval outcomes & PO issued
INSERT IGNORE INTO notifications (id, user_id, title, message, type, is_read, link, created_at)
VALUES (12, 6, 'Quotation Accepted!', 'Your quotation QTN-20260606-0001 for "Office IT Equipment Upgrade" has been approved. A Purchase Order will follow shortly.', 'QUOTATION', true, '/vendor/quotations/1', '2026-06-07 16:05:00');

INSERT IGNORE INTO notifications (id, user_id, title, message, type, is_read, link, created_at)
VALUES (13, 6, 'Purchase Order Issued', 'Purchase Order PO-20260607-0001 (₹18,645.00) has been issued for your quotation. Please acknowledge.', 'GENERAL', false, '/vendor/purchase-orders/1', '2026-06-07 17:05:00');

INSERT IGNORE INTO notifications (id, user_id, title, message, type, is_read, link, created_at)
VALUES (14, 8, 'Quotation Rejected', 'Your quotation QTN-20260607-0003 for "High-grade Aluminum Sheets" was not selected. Reason: Price above budget.', 'QUOTATION', false, '/vendor/quotations/3', '2026-06-08 15:05:00');

-- Invoice notification
INSERT IGNORE INTO notifications (id, user_id, title, message, type, is_read, link, created_at)
VALUES (15, 2, 'Invoice Generated', 'Invoice INV-20260610-0001 (₹19,470.00) has been generated for PO-20260607-0001. Payment due by 2026-06-25.', 'INVOICE', false, '/procurement/invoices/1', '2026-06-10 10:05:00');

-- Admin notification
INSERT IGNORE INTO notifications (id, user_id, title, message, type, is_read, link, created_at)
VALUES (16, 1, 'Monthly Summary', 'June procurement summary: 5 RFQs created, 5 quotations received, 2 POs issued, 2 invoices generated. Total spend: ₹45,510.00', 'GENERAL', false, '/admin/dashboard', '2026-06-06 08:00:00');

-- =============================================
-- ACTIVITY LOGS
-- =============================================
-- RFQ lifecycle
INSERT IGNORE INTO activity_logs (id, user_id, entity_type, entity_id, action, description, created_at)
VALUES (1, 2, 'RFQ', 1, 'CREATED', 'Rahul Sharma created RFQ "Office IT Equipment Upgrade" (RFQ-20260606-0001) with budget ₹75,000.', '2026-06-06 09:00:00');

INSERT IGNORE INTO activity_logs (id, user_id, entity_type, entity_id, action, description, created_at)
VALUES (2, 2, 'RFQ', 1, 'PUBLISHED', 'Rahul Sharma published RFQ-20260606-0001 and invited 1 vendor.', '2026-06-06 10:00:00');

INSERT IGNORE INTO activity_logs (id, user_id, entity_type, entity_id, action, description, created_at)
VALUES (3, 3, 'RFQ', 2, 'CREATED', 'Priya Patel created RFQ "High-grade Aluminum Sheets" (RFQ-20260606-0002) with budget ₹1,20,000.', '2026-06-06 10:30:00');

INSERT IGNORE INTO activity_logs (id, user_id, entity_type, entity_id, action, description, created_at)
VALUES (4, 3, 'RFQ', 2, 'PUBLISHED', 'Priya Patel published RFQ-20260606-0002 and invited 2 vendors.', '2026-06-06 11:00:00');

INSERT IGNORE INTO activity_logs (id, user_id, entity_type, entity_id, action, description, created_at)
VALUES (5, 2, 'RFQ', 3, 'CREATED', 'Rahul Sharma created RFQ "Safety Equipment for Factory Floor" (RFQ-20260601-0003) with budget ₹45,000.', '2026-06-01 09:00:00');

INSERT IGNORE INTO activity_logs (id, user_id, entity_type, entity_id, action, description, created_at)
VALUES (6, 2, 'RFQ', 3, 'CLOSED', 'RFQ-20260601-0003 was closed after vendor selection and PO generation.', '2026-06-03 16:00:00');

-- Quotation lifecycle
INSERT IGNORE INTO activity_logs (id, user_id, entity_type, entity_id, action, description, created_at)
VALUES (7, 6, 'QUOTATION', 1, 'SUBMITTED', 'Amit Kumar (Tech Supply Solutions) submitted quotation QTN-20260606-0001 for ₹18,645.00.', '2026-06-07 10:00:00');

INSERT IGNORE INTO activity_logs (id, user_id, entity_type, entity_id, action, description, created_at)
VALUES (8, 7, 'QUOTATION', 2, 'SUBMITTED', 'Kavita Singh (Industrial Parts Co) submitted quotation QTN-20260607-0002 for ₹1,09,250.00.', '2026-06-08 09:00:00');

INSERT IGNORE INTO activity_logs (id, user_id, entity_type, entity_id, action, description, created_at)
VALUES (9, 8, 'QUOTATION', 3, 'SUBMITTED', 'Rajesh Gupta (Global Materials Ltd) submitted quotation QTN-20260607-0003 for ₹1,23,900.00.', '2026-06-08 11:00:00');

INSERT IGNORE INTO activity_logs (id, user_id, entity_type, entity_id, action, description, created_at)
VALUES (10, 8, 'QUOTATION', 4, 'SUBMITTED', 'Rajesh Gupta (Global Materials Ltd) submitted quotation QTN-20260602-0004 for ₹25,575.00.', '2026-06-02 15:00:00');

-- Approval lifecycle
INSERT IGNORE INTO activity_logs (id, user_id, entity_type, entity_id, action, description, created_at)
VALUES (11, 4, 'APPROVAL', 1, 'APPROVED', 'Manager Ankit Mehta approved quotation QTN-20260606-0001. Remarks: Competitive pricing with good warranty terms.', '2026-06-07 16:00:00');

INSERT IGNORE INTO activity_logs (id, user_id, entity_type, entity_id, action, description, created_at)
VALUES (12, 5, 'APPROVAL', 3, 'REJECTED', 'Manager Sneha Desai rejected quotation QTN-20260607-0003. Remarks: Price above budget and delivery too long.', '2026-06-08 15:00:00');

INSERT IGNORE INTO activity_logs (id, user_id, entity_type, entity_id, action, description, created_at)
VALUES (13, 10, 'APPROVAL', 4, 'APPROVED', 'Manager Neha Sharma approved quotation QTN-20260602-0004. Remarks: BIS-certified, meets compliance.', '2026-06-03 14:00:00');

-- PO lifecycle
INSERT IGNORE INTO activity_logs (id, user_id, entity_type, entity_id, action, description, created_at)
VALUES (14, 2, 'PO', 1, 'CREATED', 'Rahul Sharma generated Purchase Order PO-20260607-0001 (₹18,645.00) for Tech Supply Solutions.', '2026-06-07 17:00:00');

INSERT IGNORE INTO activity_logs (id, user_id, entity_type, entity_id, action, description, created_at)
VALUES (15, 2, 'PO', 2, 'CREATED', 'Rahul Sharma generated Purchase Order PO-20260603-0002 (₹25,575.00) for Global Materials Ltd.', '2026-06-03 15:00:00');

INSERT IGNORE INTO activity_logs (id, user_id, entity_type, entity_id, action, description, created_at)
VALUES (16, 2, 'PO', 2, 'COMPLETED', 'Purchase Order PO-20260603-0002 marked as completed. All items delivered and verified.', '2026-06-13 12:00:00');

-- Invoice lifecycle
INSERT IGNORE INTO activity_logs (id, user_id, entity_type, entity_id, action, description, created_at)
VALUES (17, 2, 'INVOICE', 1, 'CREATED', 'Invoice INV-20260610-0001 (₹19,470.00) generated for PO-20260607-0001. Due date: 2026-06-25.', '2026-06-10 10:00:00');

INSERT IGNORE INTO activity_logs (id, user_id, entity_type, entity_id, action, description, created_at)
VALUES (18, 2, 'INVOICE', 2, 'CREATED', 'Invoice INV-20260615-0002 (₹26,040.00) generated for PO-20260603-0002. Due date: 2026-06-30.', '2026-06-15 11:00:00');

INSERT IGNORE INTO activity_logs (id, user_id, entity_type, entity_id, action, description, created_at)
VALUES (19, 2, 'INVOICE', 2, 'PAID', 'Invoice INV-20260615-0002 marked as fully paid. Payment received from Global Materials Ltd.', '2026-06-20 14:00:00');

-- Vendor management
INSERT IGNORE INTO activity_logs (id, user_id, entity_type, entity_id, action, description, created_at)
VALUES (20, 1, 'VENDOR', 1, 'CREATED', 'Vendor "Tech Supply Solutions" (Amit Kumar) registered and activated on the platform.', '2026-06-01 08:00:00');

INSERT IGNORE INTO activity_logs (id, user_id, entity_type, entity_id, action, description, created_at)
VALUES (21, 1, 'VENDOR', 2, 'CREATED', 'Vendor "Industrial Parts Co" (Kavita Singh) registered and activated on the platform.', '2026-06-01 08:15:00');

INSERT IGNORE INTO activity_logs (id, user_id, entity_type, entity_id, action, description, created_at)
VALUES (22, 1, 'VENDOR', 3, 'CREATED', 'Vendor "Global Materials Ltd" (Rajesh Gupta) registered and activated on the platform.', '2026-06-01 08:30:00');

INSERT IGNORE INTO activity_logs (id, user_id, entity_type, entity_id, action, description, created_at)
VALUES (23, 1, 'VENDOR', 4, 'CREATED', 'Vendor "Suresh Components Ltd" (Suresh Patel) registered and activated on the platform.', '2026-06-01 08:45:00');
