const { Composer } = require("telegraf")
const composer = new Composer()

composer.start((ctx) => {
  ctx.replyWithHTML(ctx.i18n.t("start", { ctx }))
})

composer.help(async (ctx) => await ctx.reply(ctx.i18n.t("help", { ctx })))

module.exports = composer
