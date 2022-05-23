INSERT INTO users (first_name, last_name, user_name, email, password)
VALUES 
('neo', 'temores', 'neoTemo', 'neo@example.com', 'password'),
('kait', 'temores', 'kaitTemo', 'kait@example.com', 'password'),
('leo', 'temores', 'leiTemo', 'leo@example.com', 'password');


INSERT INTO posts (post_content, user_id)
VALUES
('Hi my name is neo!', 1),
('Hello I am kait!', 2),
('I am baby leo', 3),
('I like dogs', 1),
('I like cats more', 2),
('I like to drink milk', 3);