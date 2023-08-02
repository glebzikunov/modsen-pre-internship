const { Composer } = require("telegraf")
const { User } = require("../models/User")
const weatherService = require("../services/WeatherService")
const taskService = require("../services/TaskService")
const composer = new Composer()

composer.on("callback_query", async (ctx) => {
  const buttonPressed = ctx.update.callback_query.data
  const userTgId = ctx.update.callback_query.from.id
  const userId = await getUserObjectId(userTgId)

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
      await displayWeatherNotifications(userId, ctx)
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
      await displayTasks(userId, ctx)
      break

    default:
      ctx.answerCbQuery("There is no button like that!")
      break
  }
})

async function displayWeatherNotifications(tgId, ctx) {
  try {
    const notifications = await weatherService.getAllUserWeatherNotifications(
      tgId
    )

    if (notifications.length === 0) {
      ctx.reply(ctx.i18n.t("noWeatherNotifications"))
    } else {
      const notificationList = notifications
        .map((notification, index) => {
          return `${index + 1}. ${notification.city} - ${notification.datetime}`
        })
        .join("\n")

      const message = ctx.i18n.t("weatherNotifications", {
        notifications: notificationList,
      })

      ctx.replyWithHTML(message)
    }
  } catch (error) {
    console.error("Error while fetching weather notifications:", error)
    ctx.reply("Error while fetching weather notifications.")
  }
}

async function displayTasks(tgId, ctx) {
  try {
    const tasks = await taskService.getAllUserTasks(tgId)

    if (tasks.length === 0) {
      ctx.reply(ctx.i18n.t("noTasks"))
    } else {
      const taskList = tasks
        .map((task, index) => {
          return `${index + 1}. ${task.task}`
        })
        .join("\n")

      const message = ctx.i18n.t("tasks", {
        tasks: taskList,
      })

      ctx.replyWithHTML(message)
    }
  } catch (error) {
    console.error("Error while fetching tasks:", error)
    ctx.reply("Error while fetching tasks!")
  }
}

async function getUserObjectId(tgId) {
  try {
    const user = await User.findOne({ uniqueId: tgId })
    return user._id.toString()
  } catch (error) {
    console.error("Error while fetching user:", error)
    throw error
  }
}

module.exports = composer
