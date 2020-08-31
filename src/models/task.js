const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const taskSchema = new Schema(
  {
    summary: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 150
    },
    isCompleted: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Task', taskSchema);
