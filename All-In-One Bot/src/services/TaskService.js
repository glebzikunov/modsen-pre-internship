const Task = require("../models/Task")
const TaskNotification = require("../models/TaskNotification")

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

exports.createTaskNotification = async (notify) => {
  return await TaskNotification.create(notify)
}

exports.getTaskNotificationByTaskName = async (taskName) => {
  return await TaskNotification.findOne({ task: taskName })
}

exports.getTaskNotificationById = async (id) => {
  return await TaskNotification.findById(id)
}

exports.deleteTaskNotification = async (taskName) => {
  await TaskNotification.deleteMany({ task: taskName })
}

exports.getAllUserTaskNotifications = async (tgId) => {
  return await TaskNotification.find({
    userId: tgId,
  })
}
