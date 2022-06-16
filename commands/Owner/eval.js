const { settings } = require('../../config')

module.exports = {
    name: 'eval',
    aliases: [],
    category: 'owner',
    description: '',
    async execute(client, message, args) {
        if (message.author.id !== settings.owner) return message.channel.send('You can\'t execute this command')
        if(!args[0]) return message.channel.send("Please enter JavaScript code(s).")
      
        const code = args.slice(0).join(' ');
        if(code.match("client.token") || code.match("settings.token")) return message.channel.send(" I don't have any tokens :'(")
      
        function clean(text) {
            if (typeof text !== 'string')
                text = require('util').inspect(text, { depth: 0 })
            text = text
                .replace(/`/g, '`' + String.fromCharCode(8203))
                .replace(/@/g, '@' + String.fromCharCode(8203))
            return text;
        };
    
        var evalEmbed = ""
        try {
            var evaled = clean(eval(code));
            if (evaled.constructor.name === 'Promise') evalEmbed = `\`\`\`\n${evaled}\n\`\`\``
            else evalEmbed = `\`\`\`js\n${evaled}\n\`\`\``
            
            message.channel.send(`\`\`\`js\n${evaled}\`\`\``);
        } catch (err) {
            message.channel.send(`\`\`\`js\n${err}\n\`\`\``);
        }

    }
}