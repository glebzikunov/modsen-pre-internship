const { Composer } = require("telegraf")
const composer = new Composer()

composer.command("cat", async (ctx) => await ctx.reply("Cat"))

module.exports = composer
