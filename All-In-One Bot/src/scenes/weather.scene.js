const {
  Scenes: { WizardScene },
} = require("telegraf")
const api = require("../api/index.js")
const config = require("../constants/config.js")
const cityRegex = /^\p{L}+$/u

module.exports = new WizardScene(
  "weather",
  async (ctx) => {
    try {
      await ctx.reply("Input city name or send your location")
      return ctx.wizard.next()
    } catch (error) {
      console.error(error)
    }
  },
  async (ctx) => {
    try {
      if (ctx.message.location) {
        const response = await api.getData(
          config.WEATHER_API_URL +
            "lat=" +
            ctx.message.location.latitude +
            "&lon=" +
            ctx.message.location.longitude +
            "&appid=" +
            config.WEATHER_API_KEY +
            "&units=metric",
          ctx
        )

        await ctx.replyWithHTML(ctx.i18n.t("weather", { response }))
        return ctx.scene.leave()
      } else if (cityRegex.test(ctx.message.text)) {
        const response = await api.getData(
          config.WEATHER_API_URL +
            "&appid=" +
            config.WEATHER_API_KEY +
            "&q=" +
            ctx.message.text +
            "&units=metric",
          ctx
        )

        await ctx.replyWithHTML(ctx.i18n.t("weather", { response }))
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
