'use strict';

const express = require('express');
const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const passport = require('passport');
const router = express.Router();
const {Note} = require('./models');
const jsonParser = bodyParser.json();
const { Student } = require('../students/models');
const { User } = require('../users/models');


router.use(bodyParser.json());

router.get('/:userId/:studentId', (req, res) => {
  // const { id } = req.params.studentId;
  console.log('studentId:',req.params.studentId);
  User.findById(req.params.userId)
  // User.findById({ _id: req.params.studentId, })
  // User.findById({'users.studnets._id': ObjectId(req.params.studentId)})
    .then(user => {
      // console.log('findyid:',student);
      res.json(user.students.notes);
    });
});

router.post('/:userId/:studentId', (req, res) => {
  const note = {
    subjective: req.body.subjective,
    objective: req.body.objective,
    assessment: req.body.assessment,
    plan: req.body.plan
  };
  console.log('studentId:',req.params.studentId);
  User.findById(req.params.userId)
  // User.findById( { students._id: req.params.studentId })
  // Student.findById(req.params.studentId)
    .then(user => {
      // console.log('>>',user.students[0]._id);
      // user.students.find((student) => student._id === req.params.studentId).notes.push(note);
      // let stud = user.students.find((students) => {
      //   console.log(students._id.toString(), req.params.studentId );
      //   return  students._id.toString() === req.params.studentId;
      // });
      // let stud = user.students[0]._id;

      // console.log('stud',stud);
      user.students.find((students) => students._id.toString() === req.params.studentId).notes.push(note);
      // user.students.find({tennants: mongoose.Types.ObjectId("${req.params.studentId}")}).notes.push(note);


      user.save(err => {
        if (err) {
          res.send(err);
        }
        res.json(user);
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

//   Note
//     // .find(filter)
//     .find()
//     // .populate('tags')
//     .sort({ createdAt: 'asc' })
//     .then(results => {
//       res.json(results);
//     })
//     .catch(err => {
//       next(err);
//     });
// });

// /* ========== POST/CREATE A SOAP NOTE ========== */
// router.post('/', jsonParser, (req, res, next) => {
//   let { objective, subjective, assessment, plan } = req.body;

//   //   const userId = req.user.id;
  
//   /***** Never trust users - validate input *****/
//   // if (!objective) {
//   //   const err = new Error('Missing `objective` in request body');
//   //   err.status = 400;
//   //   return next(err);
//   // }
  
//   const newNote = { objective, subjective, assessment, plan };
//   //   if (newNote.assessment === '') {
//   //     delete newNote.assessment;
//   //   }
  
//   //   Promise.all([
//   //     validateFolderId(newNote.assessment, userId),
//   //     validateTagIds(newNote.plan, userId)
//   //   ])
//   //     .then(() => 
//   Note.create(newNote)
//     .then(result => {
//       res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
//       console.log('note submitted');
//     })
//     .catch(err => {
//       next(err);
//     });
// });

module.exports = {router};