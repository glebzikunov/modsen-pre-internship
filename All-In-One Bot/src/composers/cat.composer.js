const { Composer } = require("telegraf")
const composer = new Composer()
const api = require("../api/index.js")
const { config } = require("../constants/config")

composer.command("cat", async (ctx) => {
  const response = await api.getData(config.CAT_API_URL, ctx)
  await ctx.replyWithPhoto(
    { url: response.data[0].url },
    { caption: "Random Cat picture 🐱" }
  )
})

module.exports = composer
