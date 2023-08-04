const CronJob = require("cron").CronJob
const api = require("../api/index")
const { User } = require("../models/User")
const weatherService = require("../services/WeatherService")
const taskService = require("../services/TaskService")
require("dotenv").config({ path: "./src/config/.env" })

const weatherUrl = process.env.WEATHER_API_URL
const weatherKey = process.env.WEATHER_API_KEY

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
                  weatherUrl +
                    "&appid=" +
                    weatherKey +
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
}
