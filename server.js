const express = require('express');
const User = require("./users/userDb");

const server = express();

server.use(express.json());
server.use(logger);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
});

//custom middleware

function logger(req, res, next) {
  const message = {
    method: req.method,
    url: req.url,
    time: new Date()
  };
  console.log(message);
  next();
};

// API

server.get('/api/users', (req, res) => {
  User
    .get()
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res
        .status(500)
        .json({message: 'cannot get users'})
    })
})

module.exports = server;
