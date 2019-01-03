'use strict';

const mongoose = require('mongoose');


const noteSchema = new mongoose.Schema({
  subjective: {type: String},
  objective: {type: String, required: true},
  assessment: {type: String},
  plan: {type: String, },
});

noteSchema.set('timestamps', true);

noteSchema.methods.serialize = function() {
  return {
    subjective: this.subjective || '',
    objective: this.objective || '',
    assessment: this.assessment || '',
    plan: this.plan || ''
  };
};

// noteSchema.set('toJSON', {
//   virtuals: true,
//   transform: (doc, result) => {
//     delete result._id;
//     delete result.__v;
//   }
// });

const Note = mongoose.model('Note', noteSchema);

module.exports = {Note};