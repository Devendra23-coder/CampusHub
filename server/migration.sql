-- CampusHub Migration: Add ticket_id to registrations + create notifications table
-- Run this after the initial schema.sql

USE campushub;

-- Add ticket_id column to registrations
ALTER TABLE registrations ADD COLUMN ticket_id VARCHAR(20) AFTER id;

-- Create notifications table for persistent admin notifications
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50) NOT NULL DEFAULT 'registration',
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    registration_id INT,
    event_id INT,
    is_read TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (registration_id) REFERENCES registrations(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Generate ticket_id for any existing registrations that don't have one
UPDATE registrations 
SET ticket_id = CONCAT('CH-', YEAR(registered_at), '-', LPAD(id, 6, '0'))
WHERE ticket_id IS NULL;
