-- DROP DATABASE IF EXISTS projectHowler;

-- CREATE DATABASE projectHowler;

-- \c projectHowler;

DROP TABLE IF EXISTS users, posts;
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    first_name varchar(255) NOT NULL,
    last_name varchar(255) NOT NULL,
    user_name varchar(255) NOT NUll,
    email text NOT NULL,
    password varchar(255) NOT NULL
);

CREATE TABLE posts (
post_id SERIAL PRIMARY KEY,
post_content text NOT NULL,
datetime varchar(255),
user_id INTEGER,
foreign key(user_id) references users(user_id)
);