-- CampusHub Seed Data
-- Run AFTER schema.sql:  mysql -u root -p campushub < seed.sql
--
-- Login credentials:
--   Admin:   admin@campushub.com / admin123
--   Student: rahul@student.com   / student123
--   Student: priya@student.com   / student123
--   Student: amit@student.com    / student123

USE campushub;

-- Insert admin user (password: admin123)
INSERT INTO users (name, email, password, role, phone, department) VALUES
('Admin User', 'admin@campushub.com', '$2b$10$MZyv9pNixTvLmNZTS9jfN.l7M1LMTNKvp34mrOTCVLR0LFDBR2wue', 'admin', '9876543210', 'Administration');

-- Insert sample students (password: student123)
INSERT INTO users (name, email, password, role, phone, department, year) VALUES
('Rahul Sharma', 'rahul@student.com', '$2b$10$Us0e/oiblKKmnNBY/WrV0uHka7eVVtU1EgZ1IeIRmyf31mUdIkqPq', 'student', '9876543211', 'Computer Science', '3rd Year'),
('Priya Patel', 'priya@student.com', '$2b$10$Us0e/oiblKKmnNBY/WrV0uHka7eVVtU1EgZ1IeIRmyf31mUdIkqPq', 'student', '9876543212', 'Electronics', '2nd Year'),
('Amit Kumar', 'amit@student.com', '$2b$10$Us0e/oiblKKmnNBY/WrV0uHka7eVVtU1EgZ1IeIRmyf31mUdIkqPq', 'student', '9876543213', 'Mechanical', '4th Year');

-- Insert sample events
INSERT INTO events (title, description, location, event_date, end_date, category, max_participants, created_by, status) VALUES
('Tech Fest 2026', 'Annual technology festival featuring coding competitions, robotics showcases, and tech talks from industry leaders.', 'Main Auditorium', '2026-10-15 09:00:00', '2026-10-17 18:00:00', 'Technology', 500, 1, 'upcoming'),
('Cultural Night', 'An evening of music, dance, drama, and cultural performances by students from all departments.', 'Open Air Theatre', '2026-10-20 17:00:00', '2026-10-20 22:00:00', 'Cultural', 300, 1, 'upcoming'),
('Career Fair 2026', 'Connect with top companies. Bring your resume and meet recruiters from leading tech and finance firms.', 'Convention Hall', '2026-11-05 10:00:00', '2026-11-05 16:00:00', 'Career', 200, 1, 'upcoming'),
('Hackathon: Build for Good', '24-hour hackathon focused on building solutions for social impact. Teams of 2-4.', 'CS Lab Block', '2026-11-12 08:00:00', '2026-11-13 08:00:00', 'Technology', 100, 1, 'upcoming'),
('Sports Day', 'Annual inter-department sports competition. Events include cricket, football, basketball, and athletics.', 'Sports Complex', '2026-11-20 07:00:00', '2026-11-20 18:00:00', 'Sports', 400, 1, 'upcoming');

-- Insert sample registrations
INSERT INTO registrations (user_id, event_id, status) VALUES
(2, 1, 'registered'),
(2, 2, 'registered'),
(3, 1, 'registered'),
(3, 3, 'registered'),
(4, 4, 'registered');

-- Insert sample clubs
INSERT INTO clubs (name, description, category, contact_email, created_by) VALUES
('Coding Club', 'A community of passionate programmers. We host weekly coding contests, workshops on new technologies, and build open-source projects together.', 'Technology', 'codingclub@campus.com', 1),
('Photography Society', 'Capture the world through your lens. Join us for photo walks, editing workshops, and exhibitions.', 'Arts', 'photosociety@campus.com', 1),
('Debate Forum', 'Sharpen your argumentation and public speaking skills. Participate in intra and inter-college debates.', 'Literary', 'debateforum@campus.com', 1),
('Robotics Club', 'Design, build, and program robots. Participate in national robotics competitions and innovate.', 'Technology', 'robotics@campus.com', 1),
('Music Band', 'From classical to rock, all genres welcome. Weekly jam sessions and performances at college events.', 'Arts', 'musicband@campus.com', 1);

-- Insert sample announcements
INSERT INTO announcements (title, content, priority, created_by) VALUES
('Mid-Semester Exams Schedule Released', 'The mid-semester examination schedule for all departments has been published. Please check the exam portal for your individual timetable. Exams begin on October 25th.', 'high', 1),
('Library Extended Hours', 'The central library will remain open until 11 PM during the exam period (Oct 20 - Nov 10). Student ID required for entry after 8 PM.', 'medium', 1),
('Campus Wi-Fi Maintenance', 'Wi-Fi services will be temporarily unavailable on Saturday, Oct 3rd from 2 AM to 6 AM for scheduled maintenance and upgrades.', 'low', 1),
('Scholarship Applications Open', 'Applications for the merit-based scholarship program are now open. Deadline: November 15, 2026. Apply through the student portal.', 'high', 1);
