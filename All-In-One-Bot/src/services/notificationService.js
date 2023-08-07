const CronJob = require("node-cron")
const api = require("@api/index")
const { User } = require("@models/User")
const weatherService = require("@services/weatherService")
const taskService = require("@services/taskService")
const config = require("@constants/config")
const replyMessages = require("@constants/replyMessages")

const deleteUserWeatherNotification = async (userId, weatherNotificationId) => {
  try {
    const user = await User.findOne({ _id: userId })
    let notificationIndex = 0

    user.notifications.forEach((val, index) => {
      if (val.toString() === weatherNotificationId) {
        notificationIndex = index
        return
      }
    })

    user.notifications.splice(notificationIndex, 1)
    await user.save()
  } catch (error) {
    console.error("Error deleting user weather notification!", error)
    throw error
  }
}

const displayWeatherNotifications = async (tgId, ctx) => {
  try {
    const notifications = await weatherService.getAllUserWeatherNotifications(
      tgId
    )

    if (notifications.length === 0) {
      const message = replyMessages.noWeatherNotifications
      ctx.reply(message)
    } else {
      const notificationList = notifications
        .map((notification, index) => {
          return `${index + 1}. ${notification.city} - ${notification.datetime}`
        })
        .join("\n")
      const message = replyMessages.weatherNotifications(notificationList)

      ctx.replyWithHTML(message)
    }
  } catch (error) {
    console.error("Error while fetching weather notifications:", error)
    ctx.reply("Error while fetching weather notifications.")
  }
}

const restartWeatherNotifications = async (bot) => {
  try {
    const users = await User.find({})
    users.forEach((user) => {
      const userWeatherNotifications = user.notifications
      if (userWeatherNotifications.length !== 0) {
        userWeatherNotifications.forEach((notification) => {
          getWeatherNotifyById(notification).then((notify) => {
            const { city, datetime } = notify
            const [hours, minutes] = datetime.split(":")
            const cronExpression = `${minutes} ${hours} * * *`
            const weatherNotification = CronJob.schedule(
              cronExpression,
              async () => {
                const response = await api.getDataNoContext(
                  config.WEATHER_API_URL +
                    "&appid=" +
                    config.WEATHER_API_KEY +
                    "&q=" +
                    city +
                    "&units=metric"
                )
                const message = replyMessages.weather(response)
                bot.telegram.sendMessage(user.uniqueId, message, {
                  parse_mode: "HTML",
                })
              },
              {
                scheduled: true,
                timezone: "Europe/Minsk",
              }
            )
            weatherNotification.start()
          })
        })
      }
    })
  } catch (error) {
    console.error("Error fetching users!", error)
  }
}

const displayTasks = async (tgId, ctx) => {
  try {
    const tasks = await taskService.getAllUserTasks(tgId)

    if (tasks.length === 0) {
      const message = replyMessages.noTasks
      ctx.reply(message)
    } else {
      const taskList = tasks
        .map((task, index) => {
          return `${index + 1}. ${task.task}`
        })
        .join("\n")
      const message = replyMessages.tasks(taskList)

      ctx.replyWithHTML(message)
    }
  } catch (error) {
    console.error("Error while fetching tasks:", error)
    ctx.reply("Error while fetching tasks!")
  }
}

const displayTaskNotifications = async (tgId, ctx) => {
  try {
    const notifications = await taskService.getAllUserTaskNotifications(tgId)

    if (notifications.length === 0) {
      const message = replyMessages.noTaskNotifications
      ctx.reply(message)
    } else {
      const notificationList = notifications
        .map((notification, index) => {
          return `${index + 1}. ${notification.task} - ${notification.datetime}`
        })
        .join("\n")
      const message = replyMessages.taskNotifications(notificationList)

      ctx.replyWithHTML(message)
    }
  } catch (error) {
    console.error("Error while fetching task notifications:", error)
    ctx.reply("Error while fetching task notifications.")
  }
}

const restartTaskNotifications = async (bot) => {
  try {
    const users = await User.find({})
    users.forEach((user) => {
      const userTaskNotifications = user.taskNotifications
      if (userTaskNotifications.length !== 0) {
        userTaskNotifications.forEach((notification) => {
          getTaskNotifyById(notification).then((notify) => {
            const { task, datetime } = notify
            const [hours, minutes] = datetime.split(":")
            const cronExpression = `${minutes} ${hours} * * *`
            const taskNotification = CronJob.schedule(
              cronExpression,
              async () => {
                const message = replyMessages.taskNotification(task)
                bot.telegram.sendMessage(user.uniqueId, message, {
                  parse_mode: "HTML",
                })
              },
              {
                scheduled: true,
                timezone: "Europe/Minsk",
              }
            )
            taskNotification.start()
          })
        })
      }
    })
  } catch (error) {
    console.error("Error fetching users!", error)
  }
}

const getWeatherNotifyById = async (id) => {
  return await weatherService.getWeatherNotificationById(id)
}

const getTaskNotifyById = async (id) => {
  return await taskService.getTaskNotificationById(id)
}

module.exports = {
  restartWeatherNotifications,
  restartTaskNotifications,
  getWeatherNotifyById,
  getTaskNotifyById,
  displayWeatherNotifications,
  displayTasks,
  displayTaskNotifications,
  deleteUserWeatherNotification,
}
