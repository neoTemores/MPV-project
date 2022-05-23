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

const getAllPosts = async (req, res) => {
    try {
        await pool.connect();
        let data = await pool.query('SELECT * FROM posts;')
        return res.json(data.rows)

    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    getAllUsers,
    getAllPosts
}