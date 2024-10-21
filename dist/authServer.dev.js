"use strict";

require('dotenv').config();

var express = require('express');

var app = express();

var jwt = require('jsonwebtoken');

app.use(express.urlencoded({
  extended: false
}));
app.use(express.json());
var refreshTokens = [];
app.post('/token', function (req, res) {
  var refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, function (err, user) {
    if (err) return res.sendStatus(403);
    var accessToken = generateAccessToken({
      name: user.name
    });
    res.json({
      accessToken: accessToken
    });
  });
});
app["delete"]('/logout', function (req, res) {
  refreshTokens = refreshTokens.filter(function (token) {
    return token !== req.body.token;
  });
  res.sendStatus(204);
});
app.post('/login', function (req, res) {
  // Authentication goes here
  // Authorization here with JWT
  var username = req.body.username;
  var user = {
    name: username
  };
  var accessToken = generateAccessToken(user);
  var refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
  refreshTokens.push(refreshToken);
  res.json({
    accessToken: accessToken,
    refreshToken: refreshToken
  });
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "25s"
  });
}

app.listen(8080, function () {
  console.log('Server is running on port 8080');
});