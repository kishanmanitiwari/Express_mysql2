CREATE TABLE messages(

    id INT PRIMARY KEY AUTO_INCREMENT,

    conversation_id INT NOT NULL,

    role ENUM('system','user','assistant') NOT NULL,

    content LONGTEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(conversation_id)
        REFERENCES conversations(id)
        ON DELETE CASCADE

);


CREATE TABLE messages(

    id INT PRIMARY KEY AUTO_INCREMENT,

    conversation_id INT NOT NULL,

    role ENUM('system','user','assistant') NOT NULL,

    content LONGTEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(conversation_id)
        REFERENCES conversations(id)
        ON DELETE CASCADE

);