const {
  Scenes: { WizardScene },
} = require("telegraf")
const { User } = require("../models/User")
const weatherService = require("../services/WeatherService")
require("dotenv").config({ path: ".src/config/.env" })

const cityRegex = /^\p{L}+$/u

module.exports = new WizardScene(
  "removeWeatherNotifications",
  async (ctx) => {
    try {
      await ctx.reply("Input city name:")
      return ctx.wizard.next()
    } catch (error) {
      console.error(error)
    }
  },
  async (ctx) => {
    try {
      if (cityRegex.test(ctx.message.text)) {
        if (ctx.session.weatherNotifyJob) {
          ctx.session.weatherNotifyJob.stop()
          ctx.session.weatherNotifyJob = null
        }

        const weatherNotify = await weatherService.getWeatherNotificationByCity(
          ctx.message.text
        )
        const userId = weatherNotify.userId.toString()
        const weatherNotifyId = weatherNotify._id.toString()
        await deleteUserWeatherNotification(userId, weatherNotifyId)
        await weatherService.deleteWeatherNotification(ctx.message.text)

        ctx.reply("Notification succesfully deleted")
        return ctx.scene.leave()
      } else {
        return ctx.scene.leave()
      }
    } catch (error) {
      console.error(error)
      return ctx.scene.leave()
    }
  }
)

async function deleteUserWeatherNotification(userId, weatherNotificationId) {
  try {
    const user = await User.findOne({ _id: userId })
    let notificationIndex = 0

    user.notifications.forEach((val, index) => {
      if (val.toString() === weatherNotificationId) {
        notificationIndex = index
        return
      }
    })

    user.notifications.splice(notificationIndex, 1)
    await user.save()
  } catch (error) {
    console.error("Error deleting user weather notification!", error)
    throw error
  }
}
