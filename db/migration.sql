-- DROP DATABASE IF EXISTS woofproject;

-- CREATE DATABASE shows;

-- \c shows;

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
user_id INTEGER,
foreign key(user_id) references users(user_id)
);