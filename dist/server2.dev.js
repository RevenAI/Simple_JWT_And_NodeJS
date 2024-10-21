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
app.get('/posts', authUserToGetPost, function (req, res) {
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
app.post('/login', function (req, res) {
  // Authentication goes here
  // Authorization here with JWT
  var username = req.body.username;
  var user = {
    name: username
  };
  var accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  res.json({
    accessToken: accessToken
  }); //res.status(200).json({"message": username});
});

function authUserToGetPost(req, res, next) {
  var authHeader = req.headers['authorization'];
  var token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401); //Unauthorized

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, user) {
    if (err) return res.sendStatus(403); // Forbidden

    req.user = user;
    next();
  });
}

app.listen(8080, function () {
  console.log('Server is running on port 8080');
});