'use strict';

const mongoose = require('mongoose');


const NoteSchema = new mongoose.Schema({
  subjective: {type: String},
  objective: {type: String, required: true},
  assessment: {type: String},
  plan: {type: String, },
  // studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true }
});

// NoteSchema.index({title:1, studentId:1}, {unique: true});

NoteSchema.set('timestamps', true);

NoteSchema.methods.serialize = function() {
  return {
    subjective: this.subjective || '',
    objective: this.objective || '',
    assessment: this.assessment || '',
    plan: this.plan || ' '
  };
};

// NoteSchema.set('toJSON', {
//   virtuals: true,
//   transform: (doc, result) => {
//     delete result._id;
//     delete result.__v;
//   }
// });

const Note = mongoose.model('Note', NoteSchema);

module.exports = {Note, NoteSchema};