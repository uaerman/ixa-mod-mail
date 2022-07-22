const fs = require('fs');

module.exports = (client) => {
    try {
      let event = 0
        fs.readdirSync( "./events/",).forEach((file) => {
            const events = fs.readdirSync("./events/").filter((file) =>
              file.endsWith(".js")
            );
            for (let file of events) {
              let pull = require(`../events/${file}`);
              if (pull.name) {
                console.log(`${pull.name} Loadded`)
                client.events.set(pull.name, pull);
              }
            }
          });
          
    } catch (e) {
        console.log(e.message);
    }
}