CREATE TABLE auth (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    upassword VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO auth (name, email, upassword)
VALUES
('Kishan', 'kishan@gmail.com', '123456'),
('Rahul', 'rahul@gmail.com', 'password123'),
('Priya', 'priya@gmail.com', 'admin123');