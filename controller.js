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
        let data = await pool.query('SELECT posts.post_id, posts.post_content, posts.user_id, users.user_id AS id, users.user_name from posts JOIN users on posts.user_id = users.user_id ORDER BY posts.post_id DESC;')
        return res.json(data.rows)

    } catch (error) {
        console.log(error)
    }
}

const getPostsById = async (req, res) => {
    let id = req.params.id
    try {
        await pool.connect();
        let data = await pool.query('SELECT posts.post_id, posts.post_content, posts.user_id, users.user_id AS id, users.user_name from posts JOIN users ON posts.user_id = users.user_id WHERE posts.user_id = $1 ORDER BY posts.post_id DESC;', [id])
        return res.json(data.rows)

    } catch (error) {
        console.error(error)
    }
}

const createNewPost = async (req, res) => {
    let postContent = req.body.postContent;
    let userId = req.body.userId;

    try {
        await pool.connect();
        let data = await pool.query('INSERT INTO posts (post_content, user_id) VALUES ($1, $2)', [postContent, userId])
        res.json(req.body)

    } catch (error) {
        console.error(error);
    }
}

const deletePostById = async (req, res) => {
    let postId = req.params.id
    try {
        await pool.connect();
        let data = await pool.query('DELETE FROM posts WHERE post_id = $1', [postId])
        res.json(data)

    } catch (error) {

    }
}

module.exports = {
    getAllUsers,
    createNewUser,
    getAllPosts,
    getPostsById,
    createNewPost,
    deletePostById,
}