const { Composer } = require("telegraf")
const { User } = require("../models/User")
const weatherService = require("../services/WeatherService")
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

composer.on("callback_query", async (ctx) => {
  const buttonPressed = ctx.update.callback_query.data
  const userTgId = ctx.update.callback_query.from.id

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
      const userId = await getUserObjectId(userTgId)
      await displayWeatherNotifications(userId, ctx)

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
