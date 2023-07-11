const { Telegraf } = require("telegraf")
const TelegrafI18n = require("telegraf-i18n")
const { message } = require("telegraf/filters")
const path = require("path")
require("dotenv").config()

const token = process.env.BOT_KEY
const bot = new Telegraf(token)

const i18n = new TelegrafI18n({
  defaultLanguage: "ru",
  allowMissing: false,
  directory: path.resolve(__dirname, "locales"),
})

bot.use(i18n.middleware())

bot.use(require("./composers/start.composer"))
bot.use(require("./composers/cat.composer"))
bot.use(require("./composers/dog.composer"))
bot.use(require("./composers/weather.composer"))

bot.on(message("sticker"), (ctx) => ctx.reply("👍"))
bot.hears("hi", (ctx) => ctx.reply("Hey there"))
bot.launch()

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"))
process.once("SIGTERM", () => bot.stop("SIGTERM"))
