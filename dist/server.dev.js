"use strict";

require('dotenv').config();

var express = require('express');

var app = express();

var jwt = require('jsonwebtoken');

var data = {
  posts: require('./data/posts.json'),
  setPosts: function setPosts(newData) {
    data.posts = newData;
  }
};
app.use(express.urlencoded({
  extended: false
}));
app.use(express.json());
app.get('/posts', authUserToken, function (req, res) {
  console.log(data.posts); //res.json(data.posts.filter(post => post.username === req.user.name));

  userPost = data.posts.filter(function (post) {
    return post.username === req.user.name;
  });

  if (userPost.length === 0) {
    return res.status(404).json({
      "message": "User account not found."
    });
  }

  return res.json(userPost);
});

function authUserToken(req, res, next) {
  var authHeader = req.headers['authorization'];
  var token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401); //Unauthorized

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, user) {
    if (err) return res.sendStatus(403); // Forbidden

    req.user = user;
    next();
  });
}

app.listen(3500, function () {
  console.log('Server is running on port 3500');
});