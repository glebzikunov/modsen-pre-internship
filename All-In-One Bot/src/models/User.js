const mongoose = require("mongoose")
const WeatherNotification = require("./WeatherNotification")

const userSchema = new mongoose.Schema({
  uniqueId: { type: Number, required: true, unique: true },
  username: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  notifications: [
    { type: mongoose.Schema.Types.ObjectId, ref: "WeatherNotification" },
  ],
})

const User = mongoose.model("User", userSchema)

module.exports = { User, WeatherNotification }
