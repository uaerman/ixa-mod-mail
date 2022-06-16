const client = require("../index");
const chalk = require("chalk")
const moment = require("moment")
const { log } = require("../Utils/consoleLog")

client.on("ready", async () => {
  log(chalk.red("[IXA]") + chalk.blue(` ${client.user.username} READY!`))
  client.user.setPresence({
    status: "online",
  });
  client.user.setActivity({ 
    name: "Made for You 💚", 
    type: "STREAMING", 
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" 
  });
});
