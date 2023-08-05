const {
  Scenes: { WizardScene },
} = require("telegraf")
const taskService = require("@services/taskService")
const userService = require("@services/userService")
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
        const taskNotify = await taskService.getTaskNotificationByTaskName(
          ctx.message.text
        )

        if (task) {
          const userId = task.userId.toString()
          const taskId = task._id.toString()
          await userService.deleteUserTask(userId, taskId)
          await taskService.deleteTask(ctx.message.text)

          if (taskNotify) {
            const taskNotifyId = taskNotify._id.toString()
            await userService.deleteUserTaskNotification(userId, taskNotifyId)
            await taskService.deleteTaskNotification(ctx.message.text)
          }

          ctx.reply("Task succesfully deleted")
        } else {
          ctx.reply("You don't have task with name: " + ctx.message.text)
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
