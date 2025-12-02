-- Migration: Add dismissed notifications table
-- This allows users to permanently dismiss notifications

CREATE TABLE IF NOT EXISTS dismissed_notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  organization_id INTEGER NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  notification_id VARCHAR(255) NOT NULL,
  dismissed_at TIMESTAMP DEFAULT NOW(),
  
  -- Index for fast lookups
  UNIQUE(user_id, organization_id, notification_id)
);

-- Create index for faster queries
CREATE INDEX idx_dismissed_notifications_user_org ON dismissed_notifications(user_id, organization_id);
CREATE INDEX idx_dismissed_notifications_notification_id ON dismissed_notifications(notification_id);

