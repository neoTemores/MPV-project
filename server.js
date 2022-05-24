require('dotenv').config();
const express = require('express');
const app = express();
const controller = require('./controller.js')

const PORT = process.env.PORT;

app.use(express.static('public'));
app.use(express.json());

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})


app.get('/api/users', controller.getAllUsers);

app.post('/api/users/create', controller.createNewUser)

app.get('/api/posts/all', controller.getAllPosts);

app.get('/api/posts/:id', controller.getPostsById);

app.post('/api/posts/create', controller.createNewPost);


