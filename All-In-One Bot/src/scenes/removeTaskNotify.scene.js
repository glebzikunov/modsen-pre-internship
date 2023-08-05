const {
  Scenes: { WizardScene },
} = require("telegraf")
const taskService = require("@services/taskService.js")
const userService = require("@services/userService.js")
const taskRegex = /^[a-zA-Z0-9 ]+$/

module.exports = new WizardScene(
  "removeTaskNotifications",
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
        if (ctx.session.taskNotifyJob) {
          ctx.session.taskNotifyJob.forEach((notification) => {
            if (notification.task === ctx.message.text) {
              notification.taskNotification.stop()
            }
          })
        }

        const taskNotify = await taskService.getTaskNotificationByTaskName(
          ctx.message.text
        )
        const userId = taskNotify.userId.toString()
        const taskNotifyId = taskNotify._id.toString()
        await userService.deleteUserTaskNotification(userId, taskNotifyId)
        await taskService.deleteTaskNotification(ctx.message.text)

        ctx.reply("Notification succesfully deleted")
        return ctx.scene.leave()
      } else {
        return ctx.scene.leave()
      }
    } catch (error) {
      console.error(error)
      return ctx.scene.leave()
    }
  }
)
