const {
  Telegraf,
  session,
  Scenes: { Stage },
} = require("telegraf")
const TelegrafI18n = require("telegraf-i18n")
const path = require("path")
require("dotenv").config({ path: "./src/config/.env" })

const weatherScene = require("./scenes/weather.scene")
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
const stage = new Stage([weatherScene, placeScene])
bot.use(stage.middleware())

bot.use(require("./composers/start.composer"))
bot.use(require("./composers/cat.composer"))
bot.use(require("./composers/dog.composer"))
bot.use(require("./composers/weather.composer"))
bot.use(require("./composers/place.composer"))

bot.launch()
console.log("Bot launched.")

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"))
process.once("SIGTERM", () => bot.stop("SIGTERM"))
