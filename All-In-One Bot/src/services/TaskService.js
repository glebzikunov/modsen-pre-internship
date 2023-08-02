const Task = require("../models/Task")

exports.getAllTasks = async () => {
  return await Task.find()
}

exports.getAllUserTasks = async (tgId) => {
  return await Task.find({
    userId: tgId,
  })
}

exports.createTask = async (task) => {
  return await Task.create(task)
}

exports.getTaskById = async (id) => {
  return await Task.findById(id)
}

exports.getTaskByTaskName = async (taskName) => {
  return await Task.findOne({ task: taskName })
}

exports.deleteTask = async (taskName) => {
  await Task.deleteMany({ task: taskName })
}
