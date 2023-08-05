const {
  Scenes: { WizardScene },
} = require("telegraf")
const weatherService = require("@services/weatherService")
const notificationService = require("@services/notificationService")
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
          ctx.session.weatherNotifyJob.forEach((notification) => {
            if (notification.city === ctx.message.text) {
              notification.weatherNotification.stop()
            }
          })
        }

        const weatherNotify = await weatherService.getWeatherNotificationByCity(
          ctx.message.text
        )
        const userId = weatherNotify.userId.toString()
        const weatherNotifyId = weatherNotify._id.toString()
        await notificationService.deleteUserWeatherNotification(
          userId,
          weatherNotifyId
        )
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
