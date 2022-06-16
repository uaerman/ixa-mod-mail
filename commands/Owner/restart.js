const { settings } = require('../../config')

module.exports = {
    name: 'restart',
    aliases: ['r'],
    category: 'owner',
    description: 'Restart bot.',
    async execute(client, message, args) {
        if (message.author.id !== settings.owner) return message.channel.send('You can\'t execute this command')
        process.exit(1)
    }
}