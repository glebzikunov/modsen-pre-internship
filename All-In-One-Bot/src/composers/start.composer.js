const { Composer } = require("telegraf")
const composer = new Composer()
const { User } = require("@models/User")
const replyMessages = require("@constants/replyMessages")

composer.start(async (ctx) => {
  try {
    const { id, username, first_name, last_name } = ctx.from
    const message = replyMessages.start(ctx)
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

    await ctx.replyWithHTML(message)
  } catch (error) {
    console.error("Error during /start command:", error)
  }
})

composer.help(async (ctx) => {
  const message = replyMessages.help
  await ctx.reply(message)
})

module.exports = composer
