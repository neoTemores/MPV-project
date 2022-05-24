require('dotenv').config();
const express = require('express');
const { application_name } = require('pg/lib/defaults');
const app = express();
const pool = require('./connection');
// const controller = require('./controller.js')

const PORT = process.env.PORT;

app.use(express.static('public'));
app.use(express.json());

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})

// app.get('/api/users', controller.getAllUsers)

// app.get('/api/posts', controller.getAllPosts)



app.get('/api/users', async (req, res) => {
    try {
        await pool.connect();
        let data = await pool.query('SELECT * FROM users;')
        res.json(data.rows)

    } catch (error) {
        console.log(error)
    }
})

app.get('/api/posts', async (req, res) => {
    try {
        await pool.connect();
        let data = await pool.query('SELECT * FROM users;')
        res.json(data.rows)

    } catch (error) {
        console.log(error)
    }
})

app.post('/api/users/create', async (req, res) => {
    let firstName = req.body.firstName
    let lastName = req.body.lastName
    let userName = req.body.userName
    let email = req.body.email
    let password = req.body.password

    try {
        await pool.connect();
        await pool.query('INSERT INTO users (first_name, last_name, user_name, email, password) VALUES($1, $2, $3, $4, $5);', [firstName, lastName, userName, email, password])
        res.json(req.body)
    } catch (error) {
        console.error(error);
    }
}) 