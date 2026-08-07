CREATE TABLE conversations(

    id INT PRIMARY KEY AUTO_INCREMENT,

    user_id INT NOT NULL,

    title VARCHAR(255),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(user_id)
        REFERENCES auth(id)
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