const { Composer } = require("telegraf")
const composer = new Composer()

composer.command("dog", async (ctx) => await ctx.reply("Dog"))

module.exports = composer
