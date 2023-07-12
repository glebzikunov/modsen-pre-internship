const { Composer } = require("telegraf")
const composer = new Composer()
const api = require("../api/index.js")
require("dotenv").config({ path: ".src/config/.env" })

const catUrl = process.env.CAT_API_URL

composer.command("cat", async (ctx) => {
  const response = await api.getData(catUrl, ctx)
  ctx.replyWithPhoto(
    { url: response.data[0].url },
    { caption: "Random Cat picture 🐱" }
  )
})

module.exports = composer
