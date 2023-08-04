const {
  Scenes: { WizardScene },
} = require("telegraf")
const { User } = require("../models/User")
const Task = require("../models/Task.js")
const userService = require("../services/userService")
const taskService = require("../services/taskService.js")
const taskRegex = /^[a-zA-Z0-9 ]+$/

module.exports = new WizardScene(
  "addTask",
  async (ctx) => {
    try {
      await ctx.reply("Input task name:")
      return ctx.wizard.next()
    } catch (error) {
      console.error(error)
    }
  },
  async (ctx) => {
    try {
      if (taskRegex.test(ctx.message.text)) {
        const { id } = ctx.from
        const taskName = ctx.message.text
        const user = await User.findOne({ uniqueId: id })

        if (user) {
          const existingTask = await Task.findOne({
            userId: user._id,
            task: taskName,
          })

          if (existingTask) {
            ctx.reply("Notification is already exists!")
            return ctx.scene.leave()
          }

          const newTask = {
            userId: user._id,
            task: taskName,
          }

          try {
            const task = await taskService.createTask(newTask)
            await userService.addUserTask(user, task._id)
            ctx.reply("Task added successfully!")
          } catch (error) {
            console.error("Error adding task!", error)
            ctx.reply("Error adding task!")
          }
        }
        return ctx.scene.leave()
      } else {
        ctx.scene.reenter()
      }
    } catch (error) {
      console.error(error)
      return ctx.scene.leave()
    }
  }
)
