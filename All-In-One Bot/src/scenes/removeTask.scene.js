const {
  Scenes: { WizardScene },
} = require("telegraf")
const { User } = require("../models/User")
const taskService = require("../services/TaskService.js")
require("dotenv").config({ path: ".src/config/.env" })

const taskRegex = /^[a-zA-Z0-9 ]+$/

module.exports = new WizardScene(
  "removeTask",
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
        const task = await taskService.getTaskByTaskName(ctx.message.text)
        const userId = task.userId.toString()
        const taskId = task._id.toString()

        await deleteUserTask(userId, taskId)
        await taskService.deleteTask(ctx.message.text)
        ctx.reply("Task succesfully deleted")
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

async function deleteUserTask(userId, taskId) {
  try {
    const user = await User.findOne({ _id: userId })
    let taskIndex = 0

    user.tasks.forEach((val, index) => {
      if (val.toString() === taskId) {
        taskIndex = index
        return
      }
    })

    user.tasks.splice(taskIndex, 1)
    await user.save()
  } catch (error) {
    console.error("Error deleting user task!", error)
    throw error
  }
}
