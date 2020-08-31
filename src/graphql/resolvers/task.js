import { isEmpty, isLength, isBoolean } from 'validator';
import Task from '../../models/task';

const formatTask = task => {
  return {
    _id: task._id.toString(),
    summary: task.summary.ToString(),
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString()
  };
};

const validateInput = (summary, isCompleted = null) => {
  const MIN_LENGHT = 10;
  const MAX_LENGTH = 150;

  const errors = [];
  if (isEmpty(summary) || !isLength(summary, { min: MIN_LENGHT, max: MAX_LENGTH })) {
    errors.push({
      message: `Summary does not fulfull the length requirements (${MIN_LENGHT}-${MAX_LENGTH} characters): '${summary}'`
    });
  }
  if (isCompleted !== null && !isBoolean(isCompleted.toString())) {
    errors.push({ message: `isCompleted has to be a boolean, instead got ${isCompleted}` });
  }
  if (errors.length > 0) {
    const error = new Error('The input failed validation.');
    error.code = 422;
    error.data = errors;
    throw error;
  }
};

const getTask = async id => {
  const task = await Task.findById(id);

  if (!task) {
    const error = new Error('Task not found!');
    error.code = 404;
    throw error;
  }
  return task;
};

const tasks = async ({ excludeCompleted }) => {
  let rawTasks;
  if (excludeCompleted) {
    rawTasks = await Task.find({ isCompleted: true }).sort({ createdAt: -1 });
  } else {
    rawTasks = await Task.find().sort({ createdAt: -1 });
  }

  if (!rawTasks) {
    const error = new Error('No matching tasks found.');
    error.code = 404;
    throw error;
  }

  const tasks = rawTasks.map(formatTask);
  return tasks;
},

const task = async ({ id }) => {
  const task = await getTask(id);
  return formatTask(task);
},

const createTask = async ({ summary }) => {
  validateInput(summary);
  const task = new Task({ summary });
  const createdTask = await task.save();

  if (!createdTask) {
    const error = new Error('Creation of a new task in the database failed.');
    error.code = 500;
    throw error;
  }

  return formatTask(createdTask);
},

const updateTask = async ({ id, taskUpdate }) => {
  const summary = taskUpdate.summary;
  const isCompleted = taskUpdate.isCompleted;
  validateInput(summary, isCompleted);

  const task = await getTask(id);

  task.summary = summary;
  task.isCompleted = isCompleted;
  const updateTask = task.save();
  return formatTask(updateTask);
},

const deleteTask = async ({ id }) => {
  await getTask(id);
  await Task.findByIdAndRemove(id);
  return true;
}

export default { tasks, task, createTask, updateTask, deleteTask };
