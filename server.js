const express = require('express');
const User = require('./users/userDb');
const Post = require('./posts/postDb');

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

async function validateUser(req, res, next) {
  const { body } = req;
  if (Object.keys(body).length > 0) {
    if (body.name) {
      next();
    } else {
      res
        .status(400)
        .json({message: "missing required name field"});
    }
  } else {
    res
      .status(400)
      .json({message: "missing user data"});
  }
}

async function validatePost(req, res, next) {
  const { body } = req;
  if (Object.keys(body).length > 0) {
    if (body.text) {
      next();
    } else {
      res
        .status(400)
        .json({message: "missing required text field"});
    }
  } else {
    res
      .status(400)
      .json({message: "missing post data"});
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

server.post('/api/users', validateUser, async (req, res) => {
  try {
    const user = await User.insert(req.body);
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({message: 'cannot add new user'});
  }
})

server.post('/api/posts', validatePost, async (req, res) => {
  try {
    const post = await Post.insert(req.body);
    res.status(200).json(post);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({message: 'cannot add new post'});
  }
})

module.exports = server;
