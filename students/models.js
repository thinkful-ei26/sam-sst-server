'use strict';

const mongoose = require('mongoose');
const {NoteSchema} = require('../notes/models');


const StudentSchema = new mongoose.Schema({
  name: {type: String, required: true},
  goals: {type: String, },
  notes: [NoteSchema]
  // userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }

  
});

// StudentSchema.index({name:1, userId:1}, {unique: true});

StudentSchema.set('timestamps', true);

StudentSchema.methods.serialize = function() {
  return {
    name: this.name || '',
    goals: this.goals || '',
    id: this._id
  };
};

// studentSchema.set('toJSON', {
//   virtuals: true,
//   transform: (doc, result) => {
//     delete result._id;
//     delete result.__v;
//   }
// });

const Student = mongoose.model('Student', StudentSchema);

module.exports = {Student, StudentSchema};