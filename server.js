require('dotenv').config();
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

const data = {
    posts: require('./data/posts.json'),
    setPosts: (newData) => {
        data.posts = newData;
    }
};

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/posts', authUserToken, (req, res) => {
        console.log(data.posts);
        //res.json(data.posts.filter(post => post.username === req.user.name));
        userPost = data.posts.filter(post => post.username === req.user.name);
        if (userPost.length === 0) {
            return res.status(404).json({"message": "User account not found."});
        } return res.json(userPost);
        });

function authUserToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401); //Unauthorized

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Forbidden
        req.user = user;
        next();
    })
}

app.listen(3500, () => {
    console.log('Server is running on port 3500');
});