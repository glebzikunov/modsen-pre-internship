const {
  Scenes: { WizardScene },
} = require("telegraf")
const api = require("@api/index.js")
const { User, WeatherNotification } = require("@models/User")
const userService = require("@services/userService.js")
const weatherService = require("@services/weatherService.js")
const CronJob = require("cron").CronJob
const config = require("@constants/config.js")
const cityRegex = /^\p{L}+$/u
const timeFormatRegex = /^\d{2}:\d{2}$/

module.exports = new WizardScene(
  "addWeatherNotifications",
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
        const { id } = ctx.from
        const cityName = ctx.message.text
        ctx.session.cityName = cityName
        ctx.session.uniqueId = id

        ctx.reply("Input time for daily notifications: (hh:mm)")
        return ctx.wizard.next()
      } else {
        ctx.scene.reenter()
      }
    } catch (error) {
      console.error(error)
      return ctx.scene.leave()
    }
  },
  async (ctx) => {
    try {
      if (timeFormatRegex.test(ctx.message.text)) {
        const dateTime = ctx.message.text
        const [hours, minutes] = dateTime.split(":")
        const cronExpression = `${minutes} ${hours} * * *`
        const { cityName, uniqueId } = ctx.session
        const user = await User.findOne({ uniqueId: uniqueId })
        ctx.session.weatherNotifyJob = []

        if (user) {
          const existingNotification = await WeatherNotification.findOne({
            userId: user._id,
            city: cityName,
          })

          if (existingNotification) {
            ctx.reply("Notification is already exists!")
            return ctx.scene.leave()
          }

          const newWeatherNotification = {
            userId: user._id,
            city: cityName,
            datetime: dateTime,
          }

          try {
            const weatherNotify = new CronJob(
              cronExpression,
              async () => {
                const response = await api.getData(
                  config.WEATHER_API_URL +
                    "&appid=" +
                    config.WEATHER_API_KEY +
                    "&q=" +
                    cityName +
                    "&units=metric",
                  ctx
                )

                await ctx.replyWithHTML(ctx.i18n.t("weather", { response }))
              },
              null,
              true
            )

            const notification = {
              city: cityName,
              weatherNotification: weatherNotify,
            }

            ctx.session.weatherNotifyJob.push(notification)
            weatherNotify.start()

            const weatherNotification =
              await weatherService.createWeatherNotification(
                newWeatherNotification
              )

            await userService.addUserWeatherNotification(
              user,
              weatherNotification._id
            )

            ctx.reply("Weather notification added successfully!")
          } catch (error) {
            console.error("Error adding weather notification!", error)
            ctx.reply("Error adding weather notification!")
          }

          return ctx.scene.leave()
        }
      } else {
        ctx.scene.reenter()
      }
    } catch (error) {
      console.error(error)
      return ctx.scene.leave()
    }
  }
)
