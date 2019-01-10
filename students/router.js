'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

const router = express.Router();
const jwt = require('jsonwebtoken');
const {Student} = require('./models');
const jsonParser = bodyParser.json();
const { User } = require('../users/models');
const jwtAuth = passport.authenticate('jwt', {session: false});

router.use(jwtAuth);
router.use(bodyParser.json());

router.get('/:userId', (req, res) => {
  console.log('userIssssd',req.params.userId);
  User.findById(req.params.userId)
    .then(user => {
      // console.log('>><>>',user.students);
      res.json(user.students);
    });
});

router.post('/:userId', (req, res) => {
  const studnet = {
    name: req.body.studentName,
    goals: req.body.goals,
  };

  User.findById(req.params.userId)
    .then(user => {
      // console.log('>>user:', user.students);
      user.students.push(studnet);

      user.save(err => {
        if (err) {
          return  res.send(err);
        }
        res.json(user);
      });
    });
});

router.delete('/:userId', (req, res) => {

  User.findById(req.params.userId)
    .then(user => {

      user.students.id(req.body.studentId).remove();

      user.save(err => {
        if (err) {
          res.send(err);
        }
        res.json(user.students);
      });
    });
});


// /* ========== GET/READ ALL ITEMS ========== */
// router.get('/', (req, res, next) => {
//   // const { searchTerm, folderId, tagId } = req.query;

  
//   // const userId = req.user.id;

//   // let filter = {userId};

//   // if (searchTerm) {
//   //   const re = new RegExp(searchTerm, 'i');
//   //   filter.$or = [{ 'title': re }, { 'content': re }];
//   // }

//   // if (folderId) {
//   //   filter.folderId = folderId;
//   // }

//   // if (tagId) {
//   //   filter.tags = tagId;
//   // }
//   // console.log(req.user);
//   // const userId = req.userId;
  
//   Student
//     // .finduserId
//     .find()
//     // .populate('tags')
//     .sort()
//     .then(results => {
//       res.json(results);
//     })
//     .catch(err => {
//       next(err);
//     });
// });

// /* ========== POST/CREATE A SOAP NOTE ========== */
// router.post('/', jsonParser, (req, res, next) => {
//   let { name, goals, userId } = req.body;

//   //   const userId = req.user.id;
  
//   /***** Never trust users - validate input *****/
//   // if (!name) {
//   //   const err = new Error('Missing `name` in request body');
//   //   err.status = 400;
//   //   return next(err);
//   // }
  
//   const newNote = { name, goals, userId };
//   //   if (newNote.assessment === '') {
//   //     delete newNote.assessment;
//   //   }
  
//   //   Promise.all([
//   //     validateFolderId(newNote.assessment, userId),
//   //     validateTagIds(newNote.plan, userId)
//   //   ])
//   //     .then(() => 
//   Student.create(newNote)
//     .then(result => {
//       res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
//       console.log('studnet submitted');
//     })
//     .catch(err => {
//       next(err);
//     });
// });

module.exports = {router};