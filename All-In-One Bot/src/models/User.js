const mongoose = require("mongoose")
const WeatherNotification = require("@models/WeatherNotification")
const TaskNotification = require("@models/TaskNotification")
const Task = require("@models/Task")

const userSchema = new mongoose.Schema({
  uniqueId: { type: Number, required: true, unique: true },
  username: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  notifications: [
    { type: mongoose.Schema.Types.ObjectId, ref: "WeatherNotification" },
  ],
  taskNotifications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TaskNotification",
    },
  ],
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
})

const User = mongoose.model("User", userSchema)

module.exports = { User, WeatherNotification, TaskNotification, Task }
