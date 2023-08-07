const { Composer } = require("telegraf")
const composer = new Composer()
const replyMessages = require("@constants/replyMessages")

composer.command("place", async (ctx) => {
  const message = replyMessages.place
  await ctx.reply(message, {
    reply_markup: {
      keyboard: [["Cafes"], ["Landmarks"], ["Events"]],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  })
})

composer.hears("Cafes", (ctx) => {
  return ctx.scene.enter("place", { placeType: "cafe" })
})

composer.hears("Landmarks", async (ctx) => {
  return ctx.scene.enter("place", { placeType: "landmarks" })
})

composer.hears("Events", async (ctx) => {
  return ctx.scene.enter("place", { placeType: "event" })
})

module.exports = composer
