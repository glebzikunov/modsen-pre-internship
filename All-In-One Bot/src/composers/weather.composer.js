const { Composer } = require("telegraf")
const composer = new Composer()

composer.command("weather", async (ctx) => await ctx.reply("Weather"))

module.exports = composer
