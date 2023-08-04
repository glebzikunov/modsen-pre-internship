const {
  Telegraf,
  session,
  Scenes: { Stage },
} = require("telegraf")
const rateLimit = require("telegraf-ratelimit")
const TelegrafI18n = require("telegraf-i18n")
const mongoose = require("mongoose")
const {
  restartWeatherNotifications,
  restartTaskNotifications,
} = require("../src/services/notificationService")
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

const weatherScene = require("./scenes/weather.scene")
const addWeatherNotifyScene = require("./scenes/addWeatherNotify.scene")
const removeWeatherNotifyScene = require("./scenes/removeWeatherNotify.scene")
const addTaskScene = require("./scenes/addTask.scene")
const removeTaskScene = require("./scenes/removeTask.scene")
const updateTaskScene = require("./scenes/updateTask.scene")
const placeScene = require("./scenes/place.scene")
const addTaskNotifyScene = require("./scenes/addTaskNotify.scene")
const removeTaskNotifyScene = require("./scenes/removeTaskNotify.scene")
const token = process.env.BOT_KEY

const limitConfig = {
  window: 5000,
  limit: 1,
  onLimitExceeded: (ctx, next) => ctx.reply("Rate limit exceeded"),
}
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
  addTaskScene,
  removeTaskScene,
  updateTaskScene,
  addTaskNotifyScene,
  removeTaskNotifyScene,
])
bot.use(stage.middleware())
bot.use(rateLimit(limitConfig))

bot.use(require("./composers/start.composer"))
bot.use(require("./composers/cat.composer"))
bot.use(require("./composers/dog.composer"))
bot.use(require("./composers/weather.composer"))
bot.use(require("./composers/place.composer"))
bot.use(require("./composers/weatherNotifications.composer"))
bot.use(require("./composers/tasks.composer"))
bot.use(require("./composers/keyboardHandler.composer"))
bot.use(require("./composers/taskNotifications.composer"))

bot.launch()
console.log("Bot launched.")

restartWeatherNotifications(bot)
restartTaskNotifications(bot)

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"))
process.once("SIGTERM", () => bot.stop("SIGTERM"))
