const {
  Telegraf,
  session,
  Scenes: { Stage },
} = require("telegraf")
const TelegrafI18n = require("telegraf-i18n")
const mongoose = require("mongoose")
const api = require("../src/api/index")
const { User } = require("../src/models/User")
const CronJob = require("cron").CronJob
const weatherService = require("../src/services/WeatherService")
const path = require("path")
require("dotenv").config({ path: "./src/config/.env" })

mongoose
  .connect(
    `mongodb+srv://zikunovga:${process.env.MONGO_USER_PASS}@cluster0.buvyrnx.mongodb.net/All-In-One-Test-Bot?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then((res) => console.log("Connected to Mongo DB"))
  .catch((error) => console.error(error))

restartNotifications()

const weatherUrl = process.env.WEATHER_API_URL
const weatherKey = process.env.WEATHER_API_KEY
const weatherScene = require("./scenes/weather.scene")
const addWeatherNotifyScene = require("./scenes/addWeatherNotify.scene")
const removeWeatherNotifyScene = require("./scenes/removeWeatherNotify.scene")
const placeScene = require("./scenes/place.scene")
const token = process.env.BOT_KEY
const bot = new Telegraf(token)

const i18n = new TelegrafI18n({
  defaultLanguage: "en",
  allowMissing: false,
  directory: path.resolve(__dirname, "locales"),
})

bot.use(session())
bot.use(i18n.middleware())
const stage = new Stage([
  weatherScene,
  placeScene,
  addWeatherNotifyScene,
  removeWeatherNotifyScene,
])
bot.use(stage.middleware())

bot.use(require("./composers/start.composer"))
bot.use(require("./composers/cat.composer"))
bot.use(require("./composers/dog.composer"))
bot.use(require("./composers/weather.composer"))
bot.use(require("./composers/place.composer"))
bot.use(require("./composers/weatherNotifications.composer"))

bot.launch()
console.log("Bot launched.")

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"))
process.once("SIGTERM", () => bot.stop("SIGTERM"))

async function restartNotifications() {
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

async function getWeatherNotifyById(id) {
  return await weatherService.getWeatherNotificationById(id)
}
