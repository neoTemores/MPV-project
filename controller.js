const pool = require('./connection.js');

const getAllUsers = async (req, res) => {
    try {
        let client = await pool.connect();
        let data = await client.query('SELECT * FROM users;')
        res.json(data.rows)
        client.release()
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

const createNewUser = async (req, res) => {
    let firstName = req.body.firstName
    let lastName = req.body.lastName
    let userName = req.body.userName
    let email = req.body.email
    let password = req.body.password

    try {
        let client = await pool.connect();
        let data = await client.query('INSERT INTO users (first_name, last_name, user_name, email, password) VALUES($1, $2, $3, $4, $5);', [firstName, lastName, userName, email, password])
        res.json(data.rows)
        client.release()
    } catch (error) {
        console.error(error);
        res.send(error)
    }
}

//posts.post_id
const getAllPosts = async (req, res) => {
    try {
        let client = await pool.connect();
        let data = await client.query('SELECT posts.post_id, posts.post_content, posts.datetime, posts.user_id, users.user_id AS id, users.user_name from posts JOIN users on posts.user_id = users.user_id ORDER BY posts.datetime DESC;')
        res.json(data.rows)
        client.release()

    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

const getPostsById = async (req, res) => {
    let id = req.params.id
    try {
        let client = await pool.connect();
        let data = await client.query('SELECT posts.post_id, posts.post_content, posts.datetime, posts.user_id, users.user_id AS id, users.user_name from posts JOIN users ON posts.user_id = users.user_id WHERE posts.user_id = $1 ORDER BY posts.datetime DESC;', [id])
        res.json(data.rows)
        client.release()

    } catch (error) {
        console.error(error)
        res.send(error)
    }
}

const updatePostById = async (req, res) => {
    let postId = req.params.id
    let text = req.body.text
    let datetime = req.body.datetime
    try {
        let client = await pool.connect()
        let data = await client.query('UPDATE posts SET post_content = $1, datetime = $2 WHERE post_id = $3', [text, datetime, postId])
        res.json(data.rows)
        client.release()
    } catch (error) {
        console.error(error);
        res.send(error)
    }
}
const createNewPost = async (req, res) => {
    let postContent = req.body.postContent;
    let userId = req.body.userId;
    let datetime = req.body.datetime;

    try {
        let client = await pool.connect();
        let data = await client.query('INSERT INTO posts (post_content, user_id, datetime) VALUES ($1, $2, $3)', [postContent, userId, datetime])
        res.json(data.rows)
        client.release()

    } catch (error) {
        console.error(error);
        res.send(error)
    }
}

const deletePostById = async (req, res) => {
    let postId = req.params.id
    try {
        let client = await pool.connect();
        let data = await client.query('DELETE FROM posts WHERE post_id = $1', [postId])
        res.json(data.rows)
        client.release()

    } catch (error) {
        console.error(error);
        res.send(error)
    }
}

const updateUserData = async (req, res) => {
    let userId = req.body.userId
    let firstName = req.body.firstName
    let lastName = req.body.lastName
    let email = req.body.email
    let password = req.body.password

    try {
        let client = await pool.connect();
        let data = await client.query('UPDATE users SET first_name = $1, last_name = $2, email = $3, password = $4 WHERE user_id = $5', [firstName, lastName, email, password, userId])
        res.json(data.rows)
        client.release()

    } catch (error) {
        console.error(error)
        res.send(error)
    }
}

const deleteUserById = async (req, res) => {

    try {
        let client = await pool.connect();
        let data = await client.query('DELETE FROM users WHERE user_id = $1', [req.params.id])
        res.json(data.rows)
        client.release()
    } catch (error) {
        console.error(error)
        res.send(error)
    }
}

const deleteAllUserPosts = async (req, res) => {
    try {
        let client = await pool.connect();
        let data = await client.query('DELETE FROM posts WHERE user_id = $1', [req.params.id])
        res.json(data.rows)
        client.release()
    } catch (error) {
        console.error(error)
        res.send(error)
    }

}
module.exports = {
    getAllUsers,
    createNewUser,
    getAllPosts,
    getPostsById,
    createNewPost,
    deletePostById,
    updatePostById,
    updateUserData,
    deleteUserById,
    deleteAllUserPosts
}