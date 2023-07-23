const mongoose = require("mongoose")

const weatherNotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  city: { type: String, required: true },
  datetime: { type: String, required: true },
})

const WeatherNotification = mongoose.model(
  "WeatherNotification",
  weatherNotificationSchema
)

module.exports = WeatherNotification
