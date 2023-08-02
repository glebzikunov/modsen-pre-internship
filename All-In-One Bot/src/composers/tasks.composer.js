const { Composer } = require("telegraf")
const composer = new Composer()

composer.command("tasks", async (ctx) => {
  await ctx.reply("Choose action:", {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "Add Task", callback_data: "addTask" },
          {
            text: "Delete Task",
            callback_data: "deleteTask",
          },
          {
            text: "Edit Task",
            callback_data: "editTask",
          },
        ],
        [
          {
            text: "Show Tasks",
            callback_data: "showTasks",
          },
        ],
      ],
    },
  })
})

module.exports = composer
