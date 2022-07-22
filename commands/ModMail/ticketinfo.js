const { EmbedBuilder } = require('discord.js')
const { settings, modmail, colors } = require('../../config')
const {User, Channel} = require("../../Utils/dbSchema")
const moment = require("moment")
module.exports = {
    name: 'ticket',
    aliases: ['ti'],
    category: 'modmail',
    description: "Get ticket info.",
    async execute(client, message, args) {
        const missingPermission = new EmbedBuilder()
        .setTitle("Permission Missing")
        .setColor(colors.negative)
        .setDescription("You do not have the necessary permissions to use this command.")
        if (!message.member.roles.cache.has(modmail.modRole)) return message.channel.send({embeds: [missingPermission]})
        const invalidChannel = new EmbedBuilder()
        .setTitle("Invalid Channel")
        .setColor(colors.negative)
        .setDescription("You can not use this command from this channel!")
        if (message.channel.parentId !== modmail.category) return message.channel.send({embeds: [invalidChannel]})
        const getTicket = await User.findOne({channel: message.channel.id})
        let guild = message.guild
        let member = message.guild.members.cache.get(getTicket.user)
        const userInfoEmbed = new EmbedBuilder()
        .setColor(colors.base)
        .setAuthor({name: `${member.user.tag}`, iconURL: member.user.avatarURL({ size: 1024, dynamic: false })})
        .setDescription(`**Ticket User:** \n\`\`\`${member.user.tag}\`\`\`\n\n**Ticket Creation Date:** \`\`\`${moment(getTicket.date).format('DD.MM.YYYY LTS Z')}\`\`\``)
        message.channel.send({embeds: [userInfoEmbed]})
    }
}