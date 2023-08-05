const axios = require("axios")
const config = require("@constants/config")

const getData = async (url, ctx) => {
  try {
    const response = await axios.get(url)
    return response
  } catch (error) {
    console.error(error)
    ctx.reply("Error during fetch request!")
  }
}

const getDataNoContext = async (url) => {
  try {
    const response = await axios.get(url)
    return response
  } catch (error) {
    console.error(error)
  }
}

const getCityInfo = async (cityName, ctx) => {
  try {
    const url =
      config.PLACE_INFO_URL +
      "name=" +
      cityName +
      "&apikey=" +
      config.PLACE_INFO_KEY
    const response = await axios.get(url)
    return [response.data.lat, response.data.lon]
  } catch (error) {
    console.error(error)
    ctx.reply("Error during fetch request!")
  }
}

const getPlacesData = async (placeType, latitude, longitude, ctx) => {
  let category = ""
  if (placeType === "cafe") {
    category += 13000
  } else if (placeType === "landmarks") {
    category += 16000
  } else if (placeType === "event") {
    category += 14000
  }

  const options = {
    method: "GET",
    url: config.PLACE_SEARCH_URL,
    params: {
      query: placeType,
      ll: `${latitude},${longitude}`,
      categories: category,
      sort: "POPULARITY",
      limit: "10",
    },
    headers: {
      accept: "application/json",
      Authorization: config.PLACE_SEARCH_KEY,
    },
  }

  try {
    const response = await axios.request(options)
    return response.data.results
  } catch (error) {
    console.error(error)
    ctx.reply("Error during fetch request!")
  }
}

module.exports = {
  getData,
  getDataNoContext,
  getPlacesData,
  getCityInfo,
}
