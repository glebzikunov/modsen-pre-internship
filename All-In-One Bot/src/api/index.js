const axios = require("axios")

const getData = async (url, ctx) => {
  try {
    const response = await axios.get(url)
    return response
  } catch (error) {
    console.error(error)
    ctx.reply("Error during fetch request!")
  }
}

module.exports = {
  getData,
}
