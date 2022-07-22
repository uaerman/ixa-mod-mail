const { settings, colors, modmail } = require('../../config')
const {EmbedBuilder} = require("discord.js")
const {User, Channel} = require("../../Utils/dbSchema")
module.exports = {
    name: 'uphold',
    aliases: [''],
    category: 'modmail',
    description: 'Uphold channel',
    async execute(client, message, args) {
        const missingPermission = new EmbedBuilder()
        .setTitle("Permission Missing")
        .setColor(colors.negative)
        .setDescription("You do not have the necessary permissions to use this command.")
        if (!message.member.roles.cache.has(modmail.modRole)) return message.channel.send({embeds: [missingPermission]})
        const userData = await User.findOne({channel: message.channel.id})
        const invalidChannel = new EmbedBuilder()
        .setTitle("Invalid Channel")
        .setColor(colors.negative)
        .setDescription("Please make sure to go on the correct channel.")
        if (!userData) return message.channel.send({embeds: [invalidChannel]}) 
        if (userData.hold === false) {
            const alredyUphold = new EmbedBuilder()
            .setTitle("Channel Hold")
            .setDescription(`This channel already continue. If you want hold the channel must use \`${settings.prefix}hold\` command!`)
            .setColor(colors.negative)
            message.channel.send({embeds: [alredyUphold]})
            return;
        }
        else {
            const change = await User.findOneAndUpdate({ userID: userData.user}, { $set: {hold: false } }, {new: true}).catch((error) => {
                message.reply("something went wrong...")
                console.log(error)
                return;
            })   
        }
        const userWarn = new EmbedBuilder()
        .setTitle("Channel Continue")
        .setDescription(`Mods are continue your ticket. Now you can send messages to mods!`)
        .setColor(colors.positive)
        client.users.cache.get(userData.user).send({embeds: [userWarn]})
        const holdWarn = new EmbedBuilder()
        .setTitle("Channel Continue")
        .setDescription(`This channel now continue! All messages will be send to user.`)
        .setColor(colors.positive)
        message.channel.send({embeds: [holdWarn]})
        return;
    }
}