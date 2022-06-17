const { settings, colors, modmail } = require('../../config')
const {MessageEmbed} = require("discord.js")
const {User, Channel} = require("../../Utils/dbSchema")
module.exports = {
    name: 'hold',
    aliases: ['h'],
    category: 'modmail',
    description: 'Hold channel',
    async execute(client, message, args) {
        const missingPermission = new MessageEmbed()
        .setTitle("Permission Missing")
        .setColor(colors.negative)
        .setDescription("You do not have the necessary permissions to use this command.")
        if (!message.member.roles.cache.has(modmail.modRole)) return message.channel.send({embeds: [missingPermission]})
        const userData = await User.findOne({channel: message.channel.id})
        const invalidChannel = new MessageEmbed()
        .setTitle("Invalid Channel")
        .setColor(colors.negative)
        .setDescription("Please make sure to go on the correct channel.")
        if (!userData) return message.channel.send({embeds: [invalidChannel]}) 
    
        var reason = "";   
        let reasonArgs = args.slice(0).join(' ');
        if (!reasonArgs) var reason = "No reason was provided.";
        else var reason = `Reason: ${reasonArgs}`;
        if (userData.hold === true) {
            const alredyHold = new MessageEmbed()
            .setTitle("Channel Hold")
            .setDescription(`This channel already on hold. If you want continue channel must use \`${settings.prefix}uphold\` command!`)
            .setColor(colors.negative)
            message.channel.send({embeds: [alredyHold]})
            return;
        }
        else {
            const change = await User.findOneAndUpdate({ userID: userData.user}, { $set: {hold: true } }, {new: true}).catch((error) => {
                message.reply("something went wrong...")
                console.log(error)
                return;
            })   
        }
        const userWarn = new MessageEmbed()
        .setTitle("Channel Hold")
        .setDescription(`Mods are holding your ticket, they will return as soon as possible.`)
        .setFooter({text: `${reason}`})
        .setColor(colors.negative)
        client.users.cache.get(userData.user).send({embeds: [userWarn]})
        const holdWarn = new MessageEmbed()
        .setTitle("Channel Hold")
        .setDescription(`This channel on hold! All messages will be ignored until continue.`)
        .setColor(colors.negative)
        message.channel.send({embeds: [holdWarn]})
        return;  
    }
}