const {
  Scenes: { WizardScene },
} = require("telegraf")
const Task = require("../models/Task.js")
require("dotenv").config({ path: ".src/config/.env" })

const taskRegex = /^[a-zA-Z0-9 ]+$/

module.exports = new WizardScene(
  "updateTask",
  async (ctx) => {
    try {
      await ctx.reply("Input task name to update:")
      return ctx.wizard.next()
    } catch (error) {
      console.error(error)
    }
  },
  async (ctx) => {
    try {
      if (taskRegex.test(ctx.message.text)) {
        const taskName = ctx.message.text
        ctx.session.taskName = taskName

        ctx.reply("Input new task name.")
        return ctx.wizard.next()
      } else {
        ctx.scene.reenter()
      }
    } catch (error) {
      console.error(error)
      return ctx.scene.leave()
    }
  },
  async (ctx) => {
    try {
      if (taskRegex.test(ctx.message.text)) {
        const newTaskName = ctx.message.text
        const { taskName } = ctx.session
        const task = await Task.findOne({ task: taskName })

        if (task) {
          task.task = newTaskName
          task.save()
          ctx.reply("Task updated successfully!")
          return ctx.scene.leave()
        } else {
          ctx.reply("You don't have task with name: " + taskName)
          ctx.scene.reenter()
        }
      } else {
        ctx.scene.reenter()
      }
    } catch (error) {
      console.error(error)
      ctx.reply("Error updating task!")
      return ctx.scene.leave()
    }
  }
)
