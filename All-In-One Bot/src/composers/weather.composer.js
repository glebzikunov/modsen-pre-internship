const { Composer } = require("telegraf")
const composer = new Composer()

composer.command("weather", (ctx) => {
  return ctx.scene.enter("weather")
})

module.exports = composer
