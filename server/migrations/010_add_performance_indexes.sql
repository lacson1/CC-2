-- ============================================
-- Performance Indexes Migration
-- Adds indexes for common query patterns
-- ============================================

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_username ON users (username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_org_role ON users (organization_id, role);
CREATE INDEX IF NOT EXISTS idx_users_org_active ON users (organization_id, is_active);
CREATE INDEX IF NOT EXISTS idx_users_last_login ON users (last_login_at DESC) WHERE last_login_at IS NOT NULL;

-- Visits table indexes
CREATE INDEX IF NOT EXISTS idx_visits_patient ON visits (patient_id);
CREATE INDEX IF NOT EXISTS idx_visits_doctor ON visits (doctor_id) WHERE doctor_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_visits_org_date ON visits (organization_id, visit_date DESC);
CREATE INDEX IF NOT EXISTS idx_visits_patient_date ON visits (patient_id, visit_date DESC);
CREATE INDEX IF NOT EXISTS idx_visits_status ON visits (status);
CREATE INDEX IF NOT EXISTS idx_visits_type ON visits (visit_type);
CREATE INDEX IF NOT EXISTS idx_visits_followup ON visits (follow_up_date) WHERE follow_up_date IS NOT NULL;

-- Prescriptions table indexes
CREATE INDEX IF NOT EXISTS idx_prescriptions_patient ON prescriptions (patient_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_visit ON prescriptions (visit_id) WHERE visit_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_prescriptions_org_date ON prescriptions (organization_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_prescriptions_status ON prescriptions (status);
CREATE INDEX IF NOT EXISTS idx_prescriptions_patient_status ON prescriptions (patient_id, status);

-- Lab Results table indexes
CREATE INDEX IF NOT EXISTS idx_lab_results_patient ON lab_results (patient_id);
CREATE INDEX IF NOT EXISTS idx_lab_results_org_date ON lab_results (organization_id, test_date DESC);
CREATE INDEX IF NOT EXISTS idx_lab_results_status ON lab_results (status);
CREATE INDEX IF NOT EXISTS idx_lab_results_patient_date ON lab_results (patient_id, test_date DESC);

-- Lab Orders table indexes
CREATE INDEX IF NOT EXISTS idx_lab_orders_patient ON lab_orders (patient_id);
CREATE INDEX IF NOT EXISTS idx_lab_orders_ordered_by ON lab_orders (ordered_by);
CREATE INDEX IF NOT EXISTS idx_lab_orders_org_status ON lab_orders (organization_id, status);
CREATE INDEX IF NOT EXISTS idx_lab_orders_org_date ON lab_orders (organization_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lab_orders_priority ON lab_orders (priority) WHERE priority IN ('urgent', 'stat');

-- Lab Order Items table indexes
CREATE INDEX IF NOT EXISTS idx_lab_order_items_order ON lab_order_items (lab_order_id);
CREATE INDEX IF NOT EXISTS idx_lab_order_items_test ON lab_order_items (lab_test_id);
CREATE INDEX IF NOT EXISTS idx_lab_order_items_status ON lab_order_items (status);

-- Appointments table indexes
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments (patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointments (doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_org_date ON appointments (organization_id, appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments (status);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_date ON appointments (doctor_id, appointment_date, appointment_time);

-- Messages table indexes
CREATE INDEX IF NOT EXISTS idx_messages_patient ON messages (patient_id);
CREATE INDEX IF NOT EXISTS idx_messages_staff ON messages (staff_id) WHERE staff_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_messages_org_status ON messages (organization_id, status);
CREATE INDEX IF NOT EXISTS idx_messages_assigned ON messages (assigned_to) WHERE assigned_to IS NOT NULL;

-- Audit Logs table indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs (timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs (action);

-- Vital Signs table indexes
CREATE INDEX IF NOT EXISTS idx_vital_signs_patient ON vital_signs (patient_id);
CREATE INDEX IF NOT EXISTS idx_vital_signs_patient_date ON vital_signs (patient_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_vital_signs_org_date ON vital_signs (organization_id, recorded_at DESC);

-- Vaccinations table indexes
CREATE INDEX IF NOT EXISTS idx_vaccinations_patient ON vaccinations (patient_id);
CREATE INDEX IF NOT EXISTS idx_vaccinations_patient_date ON vaccinations (patient_id, date_administered DESC);
CREATE INDEX IF NOT EXISTS idx_vaccinations_next_due ON vaccinations (next_due_date) WHERE next_due_date IS NOT NULL;

-- Allergies table indexes
CREATE INDEX IF NOT EXISTS idx_allergies_patient ON allergies (patient_id);
CREATE INDEX IF NOT EXISTS idx_allergies_type ON allergies (type);
CREATE INDEX IF NOT EXISTS idx_allergies_severity ON allergies (severity);

-- Medical History table indexes
CREATE INDEX IF NOT EXISTS idx_medical_history_patient ON medical_history (patient_id);
CREATE INDEX IF NOT EXISTS idx_medical_history_type ON medical_history (type);
CREATE INDEX IF NOT EXISTS idx_medical_history_status ON medical_history (status);

-- Invoices table indexes
CREATE INDEX IF NOT EXISTS idx_invoices_patient ON invoices (patient_id);
CREATE INDEX IF NOT EXISTS idx_invoices_org_status ON invoices (organization_id, status);
CREATE INDEX IF NOT EXISTS idx_invoices_org_date ON invoices (organization_id, issue_date DESC);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices (due_date) WHERE status NOT IN ('paid', 'cancelled');

-- Payments table indexes
CREATE INDEX IF NOT EXISTS idx_payments_invoice ON payments (invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_patient ON payments (patient_id);
CREATE INDEX IF NOT EXISTS idx_payments_org_date ON payments (organization_id, payment_date DESC);

-- Error Logs table indexes
CREATE INDEX IF NOT EXISTS idx_error_logs_org ON error_logs (organization_id) WHERE organization_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_error_logs_type ON error_logs (type);
CREATE INDEX IF NOT EXISTS idx_error_logs_severity ON error_logs (severity);
CREATE INDEX IF NOT EXISTS idx_error_logs_date ON error_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_error_logs_unresolved ON error_logs (created_at DESC) WHERE resolved = false;

-- System Health table indexes
CREATE INDEX IF NOT EXISTS idx_system_health_metric ON system_health (metric);
CREATE INDEX IF NOT EXISTS idx_system_health_timestamp ON system_health (timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_system_health_org ON system_health (organization_id, timestamp DESC) WHERE organization_id IS NOT NULL;

-- Consultation Records table indexes
CREATE INDEX IF NOT EXISTS idx_consultation_records_patient ON consultation_records (patient_id);
CREATE INDEX IF NOT EXISTS idx_consultation_records_form ON consultation_records (form_id);
CREATE INDEX IF NOT EXISTS idx_consultation_records_visit ON consultation_records (visit_id) WHERE visit_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_consultation_records_date ON consultation_records (created_at DESC);

-- AI Consultations table indexes
CREATE INDEX IF NOT EXISTS idx_ai_consultations_patient ON ai_consultations (patient_id);
CREATE INDEX IF NOT EXISTS idx_ai_consultations_provider ON ai_consultations (provider_id);
CREATE INDEX IF NOT EXISTS idx_ai_consultations_org_status ON ai_consultations (organization_id, status);
CREATE INDEX IF NOT EXISTS idx_ai_consultations_date ON ai_consultations (created_at DESC);

-- Comments table indexes
CREATE INDEX IF NOT EXISTS idx_comments_patient ON comments (patient_id);
CREATE INDEX IF NOT EXISTS idx_comments_user ON comments (user_id);
CREATE INDEX IF NOT EXISTS idx_comments_reply ON comments (reply_to_id) WHERE reply_to_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_comments_date ON comments (created_at DESC);

-- User Organizations table indexes
CREATE INDEX IF NOT EXISTS idx_user_orgs_user ON user_organizations (user_id);
CREATE INDEX IF NOT EXISTS idx_user_orgs_org ON user_organizations (organization_id);
CREATE INDEX IF NOT EXISTS idx_user_orgs_default ON user_organizations (user_id, is_default) WHERE is_default = true;

-- Tab Configs table indexes
CREATE INDEX IF NOT EXISTS idx_tab_configs_org ON tab_configs (organization_id) WHERE organization_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tab_configs_user ON tab_configs (user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tab_configs_role ON tab_configs (role_id) WHERE role_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tab_configs_scope ON tab_configs (scope);

-- Dismissed Notifications table indexes
CREATE INDEX IF NOT EXISTS idx_dismissed_notifications_user ON dismissed_notifications (user_id);
CREATE INDEX IF NOT EXISTS idx_dismissed_notifications_org ON dismissed_notifications (organization_id);
CREATE INDEX IF NOT EXISTS idx_dismissed_notifications_user_notification ON dismissed_notifications (user_id, notification_id);

-- Analyze tables to update statistics after creating indexes
ANALYZE users;
ANALYZE patients;
ANALYZE visits;
ANALYZE prescriptions;
ANALYZE lab_results;
ANALYZE lab_orders;
ANALYZE lab_order_items;
ANALYZE appointments;
ANALYZE messages;
ANALYZE audit_logs;
ANALYZE vital_signs;
ANALYZE vaccinations;
ANALYZE allergies;
ANALYZE medical_history;
ANALYZE invoices;
ANALYZE payments;
ANALYZE error_logs;
ANALYZE system_health;
ANALYZE consultation_records;
ANALYZE ai_consultations;
ANALYZE comments;
ANALYZE user_organizations;
ANALYZE tab_configs;
ANALYZE dismissed_notifications;

