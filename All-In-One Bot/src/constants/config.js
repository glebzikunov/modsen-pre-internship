require("dotenv").config({ path: "./src/config/.env" })

const config = {
  BOT_KEY: process.env.BOT_KEY,
  WEATHER_API_KEY: process.env.WEATHER_API_KEY,
  WEATHER_API_URL: process.env.WEATHER_API_URL,
  DOG_API_URL: process.env.DOG_API_URL,
  CAT_API_URL: process.env.CAT_API_URL,
  PLACE_INFO_URL: process.env.PLACE_INFO_URL,
  PLACE_INFO_KEY: process.env.PLACE_INFO_KEY,
  PLACE_SEARCH_URL: process.env.PLACE_SEARCH_URL,
  PLACE_SEARCH_KEY: process.env.PLACE_SEARCH_KEY,
  MONGO_USER_PASS: process.env.MONGO_USER_PASS,
}

module.exports = config
