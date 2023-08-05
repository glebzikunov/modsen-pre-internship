const { Composer } = require("telegraf")
const composer = new Composer()
const api = require("@api/index.js")
const config = require("@constants/config")

composer.command("dog", async (ctx) => {
  const response = await api.getData(config.DOG_API_URL, ctx)
  await ctx.replyWithPhoto(
    { url: response.data.url },
    { caption: "Random Dog picture 🐶" }
  )
})

module.exports = composer
