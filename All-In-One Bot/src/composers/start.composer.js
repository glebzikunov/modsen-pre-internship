const { Composer } = require("telegraf")
const composer = new Composer()

composer.start((ctx) => {
  if (ctx.from.first_name && ctx.from.last_name) {
    ctx.reply(ctx.i18n.t("start", { ctx }))
  } else {
    ctx.reply(ctx.i18n.t("start", { ctx }))
  }
})

composer.help((ctx) => ctx.reply(ctx.i18n.t("help", { ctx })))

module.exports = composer
