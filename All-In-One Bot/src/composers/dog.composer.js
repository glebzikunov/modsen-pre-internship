const { Composer } = require("telegraf")
const composer = new Composer()
const api = require("../api/index.js")
require("dotenv").config({ path: ".src/config/.env" })

const dogUrl = process.env.DOG_API_URL

composer.command("dog", async (ctx) => {
  const response = await api.getData(dogUrl, ctx)
  await ctx.replyWithPhoto(
    { url: response.data.url },
    { caption: "Random Dog picture 🐶" }
  )
})

module.exports = composer
