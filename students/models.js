'use strict';

const mongoose = require('mongoose');


const studentSchema = new mongoose.Schema({
  name: {type: String, required: true},
  goals: {type: String, },
  
});

studentSchema.set('timestamps', true);

studentSchema.methods.serialize = function() {
  return {
    name: this.name || '',
    goals: this.goals || '',
  };
};

// studentSchema.set('toJSON', {
//   virtuals: true,
//   transform: (doc, result) => {
//     delete result._id;
//     delete result.__v;
//   }
// });

const Student = mongoose.model('Student', studentSchema);

module.exports = {Student};