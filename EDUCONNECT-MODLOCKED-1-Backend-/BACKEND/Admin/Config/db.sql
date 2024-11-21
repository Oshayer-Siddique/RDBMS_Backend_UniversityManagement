CREATE DATABASE university_management;
USE school_management;


-- Department table
CREATE TABLE department (
    department_id BIGINT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location TEXT,
    dept_email VARCHAR(255) UNIQUE NOT NULL
);

-- Department Admin table
CREATE TABLE department_admin (
    department_admin_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    department_id BIGINT,
    FOREIGN KEY (department_id) REFERENCES department(department_id) ON DELETE SET NULL
);

-- Admin table
CREATE TABLE admin (
    admin_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Teacher table
CREATE TABLE teacher (
    teacher_id BIGINT PRIMARY KEY,
    department_id BIGINT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    date_of_birth DATE,
    blood_group VARCHAR(3),
    department_name VARCHAR(100),
    address TEXT,
    phone_number VARCHAR(15),
    FOREIGN KEY (department_id) REFERENCES department(department_id) ON DELETE SET NULL
);
-- Student table
CREATE TABLE student (
    student_id BIGINT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    address TEXT,
    date_of_birth DATE,
    department VARCHAR(100),
    phone_number VARCHAR(15),
    blood_group VARCHAR(3)
);


-- Course table
CREATE TABLE course (
    course_id BIGINT PRIMARY KEY,
    department_id BIGINT,
    course_department VARCHAR(255),  -- New column for department name
    title VARCHAR(255) NOT NULL,
    description TEXT,
    FOREIGN KEY (department_id) REFERENCES department(department_id) ON DELETE SET NULL
);

-- Teacher Assignment table (relationship between teacher and course)
CREATE TABLE teacher_assignment (
    teacher_id BIGINT,
    course_id BIGINT,
    PRIMARY KEY (teacher_id, course_id),
    FOREIGN KEY (teacher_id) REFERENCES teacher(teacher_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE CASCADE
);

-- Student Enrollment table (relationship between student and course)
CREATE TABLE student_enroll (
    student_id BIGINT,
    course_id BIGINT,
    PRIMARY KEY (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES student(student_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE CASCADE
);

-- Assignment table
CREATE TABLE assignment (
    assignment_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    course_id BIGINT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATETIME,
    max_points BIGINT,
    FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE CASCADE
);

ALTER TABLE assignment ADD COLUMN file_path VARCHAR(255);


-- Submission table
CREATE TABLE submission (
    submission_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    assignment_id BIGINT,
    student_id BIGINT,
    content TEXT,
    submitted_at DATETIME,
    score BIGINT,
    FOREIGN KEY (assignment_id) REFERENCES assignment(assignment_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES student(student_id) ON DELETE CASCADE
);

-- Announcement table
CREATE TABLE announcement (
    announcement_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    course_id BIGINT,
    content TEXT NOT NULL,
    posted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE CASCADE
);


--notification table


CREATE TABLE notifications (
    notification_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT,
    course_id BIGINT,  -- Match this data type with course(course_id)
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student(student_id),
    FOREIGN KEY (course_id) REFERENCES course(course_id)
);




