-- Dummy Data for Bikepath (Fresh Start)
-- Pasang ini setelah bikepath.sql

USE `bikepath`;

SET FOREIGN_KEY_CHECKS = 0;

-- Menggunakan DELETE sebagai ganti TRUNCATE untuk menghindari error foreign key constraint
DELETE FROM community_messages;
DELETE FROM community_members;
DELETE FROM communities;
DELETE FROM activities;
DELETE FROM friendships;
DELETE FROM user_profiles;
DELETE FROM users;

SET FOREIGN_KEY_CHECKS = 1;

-- 1. Users (Password default: 123456)
INSERT INTO users (id, username, email, password, role) VALUES 
(1, 'ahmad_rider', 'ahmad@example.com', '$2y$10$YkG.0pEwRjZ8.v3yvV6nGO9Q.yY0J2J.Z.I.o8ePZJ3G.O.D.G', 'user'),
(2, 'budi_mtb', 'budi@example.com', '$2y$10$YkG.0pEwRjZ8.v3yvV6nGO9Q.yY0J2J.Z.I.o8ePZJ3G.O.D.G', 'user'),
(3, 'siti_cyclist', 'siti@example.com', '$2y$10$YkG.0pEwRjZ8.v3yvV6nGO9Q.yY0J2J.Z.I.o8ePZJ3G.O.D.G', 'user'),
(4, 'dian_pro', 'dian@example.com', '$2y$10$YkG.0pEwRjZ8.v3yvV6nGO9Q.yY0J2J.Z.I.o8ePZJ3G.O.D.G', 'user'),
(5, 'eko_folding', 'eko@example.com', '$2y$10$YkG.0pEwRjZ8.v3yvV6nGO9Q.yY0J2J.Z.I.o8ePZJ3G.O.D.G', 'user');

-- 2. User Profiles
INSERT INTO user_profiles (user_id, full_name, bike_type, cycling_level) VALUES 
(1, 'Ahmad Hidayat', 'Road Bike', 'intermediate'),
(2, 'Budi Santoso', 'MTB', 'pro'),
(3, 'Siti Aminah', 'Folding Bike', 'beginner'),
(4, 'Dian Pratama', 'Road Bike', 'pro'),
(5, 'Eko Wijaya', 'Folding Bike', 'intermediate');

-- 3. Communities
INSERT INTO communities (id, name, description, created_by) VALUES 
(1, 'Jakarta Road Bike', 'Komunitas pecinta balap sepeda di Jakarta', 1),
(2, 'Bandung MTB Trails', 'Sharing rute gowes gunung di daerah Bandung', 2),
(3, 'Folding Bike Fun', 'Gowes santai pake sepeda lipat', 3),
(4, 'Night Ride JKT', 'Gowes malam hari keliling Jakarta', 1),
(5, 'MTB Indonesia', 'Wadah sharing hobi sepeda gunung se-Indonesia', 4);

-- 4. Community Members
INSERT INTO community_members (community_id, user_id) VALUES 
(1, 1), (1, 4), 
(2, 2), (2, 4),
(3, 3), (3, 5),
(4, 1), (4, 3), (4, 5),
(5, 4), (5, 2);

-- 5. Friendships
INSERT INTO friendships (user_id, friend_id) VALUES 
(1, 2), (1, 3), 
(2, 1), 
(3, 1), (3, 5);

-- 6. Activities (Sample Data)
INSERT INTO activities (user_id, name, distance, duration, calories, activity_date, notes) VALUES 
(1, 'Morning Ride', 12.50, 45, 625, '2026-05-20 07:00:00', 'Gowes pagi keliling GBK - Sangat menyegarkan'),
(1, 'Afternoon Ride', 25.00, 90, 1250, '2026-05-22 16:30:00', 'Latihan interval Sudirman-Thamrin'),
(2, 'MTB Adventure', 15.20, 120, 760, '2026-05-21 08:30:00', 'Downhill di Cikole Lembang - Jalur licin seru!'),
(3, 'Afternoon Ride', 5.00, 30, 250, '2026-05-22 17:00:00', 'Cari takjil pake seli santai aja');

-- 7. Community Messages
INSERT INTO community_messages (community_id, user_id, message) VALUES 
(1, 1, 'Halo semuanya! Ada yang mau gowes bareng besok pagi?'),
(1, 4, 'Boleh tuh, jam berapa kumpulnya?'),
(4, 3, 'Night ride malam ini rutenya kemana ya?');
