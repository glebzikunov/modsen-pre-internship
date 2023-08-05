const { Composer } = require("telegraf")
const userService = require("@services/userService")
const notificationService = require("@services/notificationService")
const composer = new Composer()

composer.on("callback_query", async (ctx) => {
  const buttonPressed = ctx.update.callback_query.data
  const userTgId = ctx.update.callback_query.from.id
  const userId = await userService.getUserObjectId(userTgId)

  switch (buttonPressed) {
    case "addWeatherNotification":
      ctx.answerCbQuery("AddNotification")
      ctx.scene.enter("addWeatherNotifications")
      break

    case "removeWeatherNotification":
      ctx.answerCbQuery("RemoveNotification")
      ctx.scene.enter("removeWeatherNotifications")
      break

    case "showWeatherNotification":
      ctx.answerCbQuery("ShowWeatherNotification")
      await notificationService.displayWeatherNotifications(userId, ctx)
      break

    case "addTask":
      ctx.answerCbQuery("AddTask")
      ctx.scene.enter("addTask")
      break

    case "deleteTask":
      ctx.answerCbQuery("DeleteTask")
      ctx.scene.enter("removeTask")
      break

    case "editTask":
      ctx.answerCbQuery("EditTask")
      ctx.scene.enter("updateTask")
      break

    case "showTasks":
      ctx.answerCbQuery("ShowTask")
      await notificationService.displayTasks(userId, ctx)
      break

    case "addTaskNotification":
      ctx.answerCbQuery("AddTaskNotification")
      ctx.scene.enter("addTaskNotifications")
      break

    case "removeTaskNotification":
      ctx.answerCbQuery("RemoveTaskNotification")
      ctx.scene.enter("removeTaskNotifications")
      break

    case "showTaskNotification":
      ctx.answerCbQuery("ShowTaskNotification")
      await notificationService.displayTaskNotifications(userId, ctx)
      break

    default:
      ctx.answerCbQuery("There is no button like that!")
      break
  }
})

module.exports = composer
