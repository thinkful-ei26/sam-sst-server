'use strict';

const express = require('express');
const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const passport = require('passport');
const router = express.Router();
const {Note} = require('./models');
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

  Note
    // .find(filter)
    .find()
    // .populate('tags')
    .sort({ createdAt: 'asc' })
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

/* ========== POST/CREATE A SOAP NOTE ========== */
router.post('/', jsonParser, (req, res, next) => {
  let { objective, subjective, assessment, plan } = req.body;

  //   const userId = req.user.id;
  
  /***** Never trust users - validate input *****/
  // if (!objective) {
  //   const err = new Error('Missing `objective` in request body');
  //   err.status = 400;
  //   return next(err);
  // }
  
  const newNote = { objective, subjective, assessment, plan };
  //   if (newNote.assessment === '') {
  //     delete newNote.assessment;
  //   }
  
  //   Promise.all([
  //     validateFolderId(newNote.assessment, userId),
  //     validateTagIds(newNote.plan, userId)
  //   ])
  //     .then(() => 
  Note.create(newNote)
    .then(result => {
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
      console.log('note submitted');
    })
    .catch(err => {
      next(err);
    });
});

module.exports = {router};