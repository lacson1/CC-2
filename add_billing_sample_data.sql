-- Add sample service prices for common clinic services
INSERT INTO service_prices (organization_id, service_type, service_name, service_code, base_price, currency, is_active, effective_date, created_by) VALUES
(1, 'consultation', 'General Consultation', 'CONS001', 5000.00, 'NGN', true, '2024-01-01', 1),
(1, 'consultation', 'Specialist Consultation', 'CONS002', 8000.00, 'NGN', true, '2024-01-01', 1),
(1, 'consultation', 'Follow-up Consultation', 'CONS003', 3000.00, 'NGN', true, '2024-01-01', 1),
(1, 'lab_test', 'Full Blood Count', 'LAB001', 2500.00, 'NGN', true, '2024-01-01', 1),
(1, 'lab_test', 'Malaria Test', 'LAB002', 1500.00, 'NGN', true, '2024-01-01', 1),
(1, 'lab_test', 'Blood Sugar Test', 'LAB003', 1000.00, 'NGN', true, '2024-01-01', 1),
(1, 'lab_test', 'HIV Test', 'LAB004', 3000.00, 'NGN', true, '2024-01-01', 1),
(1, 'procedure', 'Blood Pressure Check', 'PROC001', 500.00, 'NGN', true, '2024-01-01', 1),
(1, 'procedure', 'ECG', 'PROC002', 4000.00, 'NGN', true, '2024-01-01', 1),
(1, 'procedure', 'X-Ray Chest', 'PROC003', 6000.00, 'NGN', true, '2024-01-01', 1),
(1, 'medication', 'Paracetamol 500mg', 'MED001', 200.00, 'NGN', true, '2024-01-01', 1),
(1, 'medication', 'Antibiotics Course', 'MED002', 1500.00, 'NGN', true, '2024-01-01', 1),
(1, 'other', 'Medical Certificate', 'OTH001', 2000.00, 'NGN', true, '2024-01-01', 1),
(1, 'other', 'Vaccination', 'OTH002', 3500.00, 'NGN', true, '2024-01-01', 1);

-- Add sample invoices for demonstration
INSERT INTO invoices (patient_id, organization_id, invoice_number, issue_date, due_date, status, subtotal, tax_amount, discount_amount, total_amount, paid_amount, balance_amount, currency, notes, created_by) VALUES
(9, 1, 'INV-1-0001', '2024-05-31', '2024-06-15', 'sent', 7500.00, 562.50, 0.00, 8062.50, 0.00, 8062.50, 'NGN', 'Consultation and lab tests for patient check-up', 1),
(9, 1, 'INV-1-0002', '2024-05-30', '2024-06-14', 'paid', 5000.00, 375.00, 0.00, 5375.00, 5375.00, 0.00, 'NGN', 'Follow-up consultation', 1);

-- Add invoice items for the first invoice (pending)
INSERT INTO invoice_items (invoice_id, description, service_type, service_id, quantity, unit_price, total_price) VALUES
(1, 'General Consultation', 'consultation', 1, 1.00, 5000.00, 5000.00),
(1, 'Full Blood Count', 'lab_test', 4, 1.00, 2500.00, 2500.00);

-- Add invoice items for the second invoice (paid)
INSERT INTO invoice_items (invoice_id, description, service_type, service_id, quantity, unit_price, total_price) VALUES
(2, 'Follow-up Consultation', 'consultation', 3, 1.00, 5000.00, 5000.00);

-- Add payment for the second invoice
INSERT INTO payments (invoice_id, patient_id, organization_id, payment_method, amount, currency, transaction_id, payment_date, status, notes, processed_by) VALUES
(2, 9, 1, 'cash', 5375.00, 'NGN', 'CASH-001', '2024-05-30 14:30:00', 'completed', 'Payment received in cash', 1);
