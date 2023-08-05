const WeatherNotification = require("@models/WeatherNotification")

exports.getAllWeatherNotifications = async () => {
  return await WeatherNotification.find()
}

exports.getAllUserWeatherNotifications = async (tgId) => {
  return await WeatherNotification.find({
    userId: tgId,
  })
}

exports.createWeatherNotification = async (notify) => {
  return await WeatherNotification.create(notify)
}

exports.getWeatherNotificationById = async (id) => {
  return await WeatherNotification.findById(id)
}

exports.getWeatherNotificationByCity = async (cityName) => {
  return await WeatherNotification.findOne({ city: cityName })
}

exports.deleteWeatherNotification = async (cityName) => {
  await WeatherNotification.deleteMany({ city: cityName })
}
