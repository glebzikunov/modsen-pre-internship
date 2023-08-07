const replyMessages = {
  start: (ctx) => `
Hello, <b>${
    ctx.from.first_name ? ctx.from.first_name : ctx.from.username
  }</b> 👋

Use /help to receive a message describing all available functions.`,

  help: `
/help — Receive a message describing all available functions.

/weather — Receive a message with the current weather in the specified city.

/cat — Receive a message with a random cat picture.

/dog — Receive a message with a random dog picture.

/weathernotify — Subscribe to daily weather notifications for a specific city.

/place — Receive a message recommending local cafes, attractions or events in a specified city.

/tasks and /tasknotify — The user can create tasks, set reminders and receive notifications from the bot.`,

  weather: (response) => `
City: <b>${response.data.name}</b> 🏙

Temperature: <b>${response.data.main.temp}</b> °C🌡

Feels like: <b>${response.data.main.feels_like}</b> °C🌡`,

  place: "Choose place type",

  placesFound: (foundList) => `
<b>Found results:</b>

${foundList}`,

  noPlacesFound: "No places found!",

  weatherNotifications: (notifications) => `
<b>Your weather notifications:</b>

${notifications}`,

  noWeatherNotifications: "You don't have any weather notifications!",

  tasks: (tasks) => `
<b>Your tasks:</b>

${tasks}`,

  noTasks: "You don't have any tasks!",

  taskNotification: (taskName) => `
<b>TASK NOTIFICATION</b>

${taskName}`,

  taskNotifications: (notifications) => `
<b>Your task notifications:</b>

${notifications}`,

  noTaskNotifications: "You don't have any task notifications!",
}

module.exports = replyMessages
