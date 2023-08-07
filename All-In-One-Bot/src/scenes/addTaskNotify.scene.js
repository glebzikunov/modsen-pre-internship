const {
  Scenes: { WizardScene },
} = require("telegraf")
const { User } = require("@models/User")
const TaskNotification = require("@models/TaskNotification.js")
const userService = require("@services/userService")
const taskService = require("@services/taskService")
const replyMessages = require("@constants/replyMessages")
const CronJob = require("node-cron")
const taskRegex = /^[a-zA-Z0-9 ]+$/
const timeFormatRegex = /^\d{2}:\d{2}$/

module.exports = new WizardScene(
  "addTaskNotifications",
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
        ctx.session.taskName = taskName
        ctx.session.uniqueId = id

        ctx.reply("Input time for notification: (hh:mm)")
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
      if (timeFormatRegex.test(ctx.message.text)) {
        const dateTime = ctx.message.text
        const [hours, minutes] = dateTime.split(":")
        const cronExpression = `${minutes} ${hours} * * *`
        const { taskName, uniqueId } = ctx.session
        const user = await User.findOne({ uniqueId: uniqueId })
        ctx.session.taskNotifyJob = []

        if (user) {
          const task = await taskService.getTaskByTaskName(taskName)
          if (task) {
            const existingNotification = await TaskNotification.findOne({
              userId: user._id,
              task: taskName,
            })

            if (existingNotification) {
              ctx.reply("Notification is already exists!")
              return ctx.scene.leave()
            }

            const newTaskNotification = {
              userId: user._id,
              task: taskName,
              datetime: dateTime,
            }

            try {
              const taskNotify = CronJob.schedule(
                cronExpression,
                async () => {
                  const message = replyMessages.taskNotification(taskName)
                  await ctx.replyWithHTML(message)
                },
                {
                  scheduled: true,
                  timezone: "Europe/Minsk",
                }
              )

              const notification = {
                task: taskName,
                taskNotification: taskNotify,
              }

              ctx.session.taskNotifyJob.push(notification)
              taskNotify.start()

              const taskNotification = await taskService.createTaskNotification(
                newTaskNotification
              )

              await userService.addUserTaskNotification(
                user,
                taskNotification._id
              )

              ctx.reply("Task notification added successfully!")
            } catch (error) {
              console.error("Error adding task notification!", error)
              ctx.reply("Error adding task notification!")
            }
          } else {
            ctx.reply("You don't have task with name: " + taskName)
            return ctx.scene.leave()
          }

          return ctx.scene.leave()
        }
      } else {
        ctx.scene.reenter()
      }
    } catch (error) {
      console.error(error)
      return ctx.scene.leave()
    }
  }
)
