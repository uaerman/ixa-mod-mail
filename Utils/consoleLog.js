const chalk = require("chalk")
const moment = require("moment")

/**
 * Fetch Json from Url
 * @param {String} message string
 */

async function log(message) {
    return new Promise((resolve, reject) => {
        console.log(`${chalk.magenta(moment().format("YYYY-MM h:mm:ss"))}  ${message}`)
  });
}
  module.exports = {
      log
  }