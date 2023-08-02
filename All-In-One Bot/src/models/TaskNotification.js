const mongoose = require("mongoose")

const taskNotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  task: { type: String, required: true },
  datetime: { type: String, required: true },
})

const TaskNotification = mongoose.model(
  "TaskNotification",
  taskNotificationSchema
)

module.exports = TaskNotification
