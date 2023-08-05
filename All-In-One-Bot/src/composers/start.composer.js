const { Composer } = require("telegraf")
const composer = new Composer()
const { User } = require("@models/User")

composer.start(async (ctx) => {
  try {
    const { id, username, first_name, last_name } = ctx.from
    let user = await User.findOne({ uniqueId: id })

    if (!user) {
      user = new User({
        uniqueId: id,
        username: username || "",
        firstName: first_name || "",
        lastName: last_name || "",
        notifications: [],
      })
      await user.save()
    }

    await ctx.replyWithHTML(ctx.i18n.t("start", { ctx }))
  } catch (error) {
    console.error("Error during /start command:", error)
  }
})

composer.help(async (ctx) => await ctx.reply(ctx.i18n.t("help", { ctx })))

module.exports = composer
