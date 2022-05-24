const pool = require('./connection.js');

const getAllUsers = async (req, res) => {
    try {
        await pool.connect();
        let data = await pool.query('SELECT * FROM users;')
        res.json(data.rows)

    } catch (error) {
        console.log(error)
    }
}

const createNewUser = async (req, res) => {
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
}


const getAllPosts = async (req, res) => {
    try {
        await pool.connect();
        let data = await pool.query('SELECT posts.post_content, posts.user_id, users.user_id AS id, users.user_name from posts JOIN users on posts.user_id = users.user_id;')
        return res.json(data.rows)

    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    getAllUsers,
    createNewUser,
    getAllPosts,
}