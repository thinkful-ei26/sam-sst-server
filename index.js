'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const passport = require('passport');

const { router: notesRouter } = require('./notes');
const { router: studnetRouter } = require('./students');
const { router: userRouter } = require('./users');
// const { router: authRouter } = require('./auth');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');


const { PORT, CLIENT_ORIGIN } = require('./config');
const { dbConnect } = require('./db-mongoose');
// const {dbConnect} = require('./db-knex');

const app = express();

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/api/notes', notesRouter);
app.use('/api/students', studnetRouter);
app.use('/api/users', userRouter);
app.use('/api/auth/login', authRouter);

app.get('/user', (req, res) => {
  res.json({msg: 'Hello SST, woo hoo'});
});

function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = { app };
