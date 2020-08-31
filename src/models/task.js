import { Schema as _Schema, model } from 'mongoose';

const Schema = _Schema;

const taskSchema = new Schema(
  {
    summary: {
      type: String,
      required: true,
      minlength: 10
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

export default model('Task', taskSchema);
