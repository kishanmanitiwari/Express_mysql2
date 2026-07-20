
CREATE TABLE IF NOT EXISTS users(
  id INT primary key auto_increment,
  name varchar(100) not null,
  email varchar(100) unique not null,
  password varchar(100) not null,
  age int,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

insert into users(name,email,password,age)
values ('Kishan','kishan@gmail.com','pass@123',22)

SELECT *
FROM users
WHERE email=''
OR 1=1 -- '
AND password='anything';

--sql injection code
'' OR 1=1 -- '
' ' or 1=1 -- ;