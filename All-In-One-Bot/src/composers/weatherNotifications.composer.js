const { Composer } = require("telegraf")
const composer = new Composer()

composer.command("weatherNotify", async (ctx) => {
  await ctx.reply("Choose action:", {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "Add Notification", callback_data: "addWeatherNotification" },
          {
            text: "Remove Notification",
            callback_data: "removeWeatherNotification",
          },
        ],
        [
          {
            text: "Show Notifications",
            callback_data: "showWeatherNotification",
          },
        ],
      ],
    },
  })
})

module.exports = composer
