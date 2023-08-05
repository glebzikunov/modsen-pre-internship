const {
  Scenes: { WizardScene },
} = require("telegraf")
const api = require("@api/index.js")
const cityRegex = /^\p{L}+$/u

module.exports = new WizardScene(
  "place",
  async (ctx) => {
    try {
      await ctx.reply(
        "Input city name (Use English or Russian language only) or send your location"
      )
      return ctx.wizard.next()
    } catch (error) {
      console.error(error)
    }
  },
  async (ctx) => {
    try {
      if (ctx.message.location) {
        const placeType = ctx.scene.state.placeType
        const latitude = ctx.message.location.latitude
        const longitude = ctx.message.location.longitude
        const places = await api.getPlacesData(
          placeType,
          latitude,
          longitude,
          ctx
        )

        if (places.length > 0) {
          const foundList = places
            .map((place, index) => {
              const address = place.location.address || "Adress is not defined"
              return `${index + 1}. <b>${place.name}</b> — ${address}`
            })
            .join("\n\n")

          await ctx.replyWithHTML(ctx.i18n.t("placesFound", { foundList }))
          return ctx.scene.leave()
        } else {
          ctx.reply(ctx.i18n.t("noPlacesFound"))
          return ctx.scene.leave()
        }
      } else if (cityRegex.test(ctx.message.text)) {
        const placeType = ctx.scene.state.placeType
        const cityName = ctx.message.text
        const [lat, lon] = await api.getCityInfo(cityName, ctx)
        const places = await api.getPlacesData(placeType, lat, lon, ctx)

        if (places.length > 0) {
          const foundList = places
            .map((place, index) => {
              const address = place.location.address || "Adress is not defined"
              return `${index + 1}. <b>${place.name}</b> — ${address}`
            })
            .join("\n\n")

          await ctx.replyWithHTML(ctx.i18n.t("placesFound", { foundList }))
          return ctx.scene.leave()
        } else {
          ctx.reply(ctx.i18n.t("noPlacesFound"))
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
