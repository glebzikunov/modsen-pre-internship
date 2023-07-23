const User = require("../models/User")

exports.getAllUsers = async () => {
  return await User.find()
}

exports.createUser = async (user) => {
  return await User.create(user)
}

exports.getUserById = async (id) => {
  return await User.findById(id)
}

exports.addUserWeatherNotification = async (user, weatherNotification) => {
  user.notifications.push(weatherNotification)
  user.save()
}
