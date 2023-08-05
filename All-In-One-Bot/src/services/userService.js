const { User } = require("@models/User")

exports.getAllUsers = async () => {
  return await User.find()
}

exports.createUser = async (user) => {
  return await User.create(user)
}

exports.getUserById = async (id) => {
  return await User.findById(id)
}

exports.getUserObjectId = async (tgId) => {
  try {
    const user = await User.findOne({ uniqueId: tgId })
    return user._id.toString()
  } catch (error) {
    console.error("Error while fetching user:", error)
    throw error
  }
}

exports.addUserWeatherNotification = async (user, weatherNotification) => {
  user.notifications.push(weatherNotification)
  user.save()
}

exports.addUserTask = async (user, task) => {
  user.tasks.push(task)
  user.save()
}

exports.addUserTaskNotification = async (user, taskNotification) => {
  user.taskNotifications.push(taskNotification)
  user.save()
}

exports.deleteUserTask = async (userId, taskId) => {
  try {
    const user = await User.findOne({ _id: userId })
    let taskIndex = 0

    user.tasks.forEach((val, index) => {
      if (val.toString() === taskId) {
        taskIndex = index
        return
      }
    })

    user.tasks.splice(taskIndex, 1)
    await user.save()
  } catch (error) {
    console.error("Error deleting user task!", error)
    throw error
  }
}

exports.deleteUserTaskNotification = async (userId, taskNotificationId) => {
  try {
    const user = await User.findOne({ _id: userId })
    let notificationIndex = 0

    user.taskNotifications.forEach((val, index) => {
      if (val.toString() === taskNotificationId) {
        notificationIndex = index
        return
      }
    })

    user.taskNotifications.splice(notificationIndex, 1)
    await user.save()
  } catch (error) {
    console.error("Error deleting user task notification!", error)
    throw error
  }
}
