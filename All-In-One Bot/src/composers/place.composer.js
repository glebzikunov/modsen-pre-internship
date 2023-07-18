const { Composer } = require("telegraf")
const composer = new Composer()

composer.command("place", async (ctx) => {
  await ctx.reply(ctx.i18n.t("place", { ctx }), {
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
