-- ============================================================
-- Student Management System - Database Schema
-- MySQL 8.x
-- ============================================================

CREATE DATABASE IF NOT EXISTS student_management_db;
USE student_management_db;

-- Table: courses
CREATE TABLE IF NOT EXISTS courses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    course_name VARCHAR(100) NOT NULL UNIQUE,
    duration_months INT,
    fee_amount DOUBLE,
    description VARCHAR(500)
);

-- Table: students
CREATE TABLE IF NOT EXISTS students (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(15),
    date_of_birth DATE,
    address VARCHAR(255),
    course VARCHAR(100) NOT NULL,
    enrollment_date DATE,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at DATETIME,
    updated_at DATETIME
);

-- Table: fees
CREATE TABLE IF NOT EXISTS fees (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    total_fee DECIMAL(10,2),
    paid_amount DECIMAL(10,2),
    due_amount DECIMAL(10,2),
    payment_date DATE,
    payment_status VARCHAR(20),
    CONSTRAINT fk_fees_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Seed data: courses
INSERT INTO courses (course_name, duration_months, fee_amount, description) VALUES
('B.Tech', 48, 400000, 'Bachelor of Technology'),
('BCA', 36, 150000, 'Bachelor of Computer Applications'),
('B.Sc', 36, 100000, 'Bachelor of Science'),
('MCA', 24, 200000, 'Master of Computer Applications'),
('MBA', 24, 300000, 'Master of Business Administration')
ON DUPLICATE KEY UPDATE course_name = course_name;

-- Seed data: students
INSERT INTO students (first_name, last_name, email, phone, date_of_birth, address, course, enrollment_date, status, created_at, updated_at) VALUES
('John', 'Doe', 'john.doe@example.com', '9876543210', '2002-05-14', '123 MG Road, Hyderabad', 'B.Tech', '2023-06-01', 'ACTIVE', NOW(), NOW()),
('Jane', 'Smith', 'jane.smith@example.com', '9876543211', '2001-11-23', '45 Park Street, Bangalore', 'BCA', '2023-07-15', 'ACTIVE', NOW(), NOW()),
('Alex', 'Roy', 'alex.roy@example.com', '9876543212', '2000-02-09', '78 Anna Nagar, Chennai', 'B.Sc', '2022-08-10', 'ACTIVE', NOW(), NOW())
ON DUPLICATE KEY UPDATE email = email;
