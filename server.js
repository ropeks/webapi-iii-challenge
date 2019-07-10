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

async function validateUserId(req, res, next) {
  const user = await User.getById(req.params.id);
  if (user) {
    req.user = user;
    next();
  } else {
    res
      .status(400)
      .json({message: 'there is no user with that id'});
  }
}

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
        .json({message: 'cannot retrieve users'})
    })
})

server.get('/api/users/:id', validateUserId, (req, res) => {
  User
    .getById(req.params.id)
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res
        .status(500)
        .json({message: 'cannot retrieve that user'})
    })
})

module.exports = server;
