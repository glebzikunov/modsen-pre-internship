const axios = require("axios")
require("dotenv").config({ path: ".src/config/.env" })

const placeInfoUrl = process.env.PLACE_INFO_URL
const placeInfoKey = process.env.PLACE_INFO_KEY
const placeSearchUrL = process.env.PLACE_SEARCH_URL
const placeSearchKey = process.env.PLACE_SEARCH_KEY

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
    const url = placeInfoUrl + "name=" + cityName + "&apikey=" + placeInfoKey
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
    url: placeSearchUrL,
    params: {
      query: placeType,
      ll: `${latitude},${longitude}`,
      categories: category,
      sort: "POPULARITY",
      limit: "10",
    },
    headers: {
      accept: "application/json",
      Authorization: placeSearchKey,
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
