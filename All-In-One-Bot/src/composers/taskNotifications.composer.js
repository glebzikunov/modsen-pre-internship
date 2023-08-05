const { Composer } = require("telegraf")
const composer = new Composer()

composer.command("taskNotify", async (ctx) => {
  await ctx.reply("Choose action:", {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "Add Notification", callback_data: "addTaskNotification" },
          {
            text: "Remove Notification",
            callback_data: "removeTaskNotification",
          },
        ],
        [
          {
            text: "Show Notifications",
            callback_data: "showTaskNotification",
          },
        ],
      ],
    },
  })
})

module.exports = composer
