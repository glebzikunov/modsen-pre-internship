const CronJob = require("cron").CronJob
const api = require("../api/index")
const { User } = require("../models/User")
const weatherService = require("./weatherService")
const taskService = require("./taskService")
const { config } = require("../constants/config")

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
      ctx.reply(ctx.i18n.t("noWeatherNotifications"))
    } else {
      const notificationList = notifications
        .map((notification, index) => {
          return `${index + 1}. ${notification.city} - ${notification.datetime}`
        })
        .join("\n")

      const message = ctx.i18n.t("weatherNotifications", {
        notifications: notificationList,
      })

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
            const weatherNotification = new CronJob(
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
                htmlMessage = `City: <b>${response.data.name}</b> 🏙

Temperature: <b>${response.data.main.temp}</b> °C🌡

Feels like: <b>${response.data.main.feels_like}</b> °C🌡`

                bot.telegram.sendMessage(user.uniqueId, htmlMessage, {
                  parse_mode: "HTML",
                })
              },
              null,
              true
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
      ctx.reply(ctx.i18n.t("noTasks"))
    } else {
      const taskList = tasks
        .map((task, index) => {
          return `${index + 1}. ${task.task}`
        })
        .join("\n")

      const message = ctx.i18n.t("tasks", {
        tasks: taskList,
      })

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
      ctx.reply(ctx.i18n.t("noTaskNotifications"))
    } else {
      const notificationList = notifications
        .map((notification, index) => {
          return `${index + 1}. ${notification.task} - ${notification.datetime}`
        })
        .join("\n")

      const message = ctx.i18n.t("taskNotifications", {
        notifications: notificationList,
      })

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
            const taskNotification = new CronJob(
              cronExpression,
              async () => {
                htmlMessage = `<b>TASK NOTIFICATION</b>

${task}`
                bot.telegram.sendMessage(user.uniqueId, htmlMessage, {
                  parse_mode: "HTML",
                })
              },
              null,
              true
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
