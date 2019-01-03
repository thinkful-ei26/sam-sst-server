'use strict';

const express = require('express');
const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const passport = require('passport');
const router = express.Router();
const {Student} = require('./models');
const jsonParser = bodyParser.json();


/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
  // const { searchTerm, folderId, tagId } = req.query;

  
  // const userId = req.user.id;

  // let filter = {userId};

  // if (searchTerm) {
  //   const re = new RegExp(searchTerm, 'i');
  //   filter.$or = [{ 'title': re }, { 'content': re }];
  // }

  // if (folderId) {
  //   filter.folderId = folderId;
  // }

  // if (tagId) {
  //   filter.tags = tagId;
  // }

  Student
    // .find(filter)
    .find()
    // .populate('tags')
    .sort()
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

/* ========== POST/CREATE A SOAP NOTE ========== */
router.post('/', jsonParser, (req, res, next) => {
  let { name, goals, } = req.body;

  //   const userId = req.user.id;
  
  /***** Never trust users - validate input *****/
  // if (!name) {
  //   const err = new Error('Missing `name` in request body');
  //   err.status = 400;
  //   return next(err);
  // }
  
  const newNote = { name, goals };
  //   if (newNote.assessment === '') {
  //     delete newNote.assessment;
  //   }
  
  //   Promise.all([
  //     validateFolderId(newNote.assessment, userId),
  //     validateTagIds(newNote.plan, userId)
  //   ])
  //     .then(() => 
  Student.create(newNote)
    .then(result => {
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
      console.log('studnet submitted');
    })
    .catch(err => {
      next(err);
    });
});

module.exports = {router};