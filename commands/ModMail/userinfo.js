const { EmbedBuilder } = require('discord.js')
const { settings, modmail, colors } = require('../../config')
const {User, Channel} = require("../../Utils/dbSchema")
const moment = require("moment")
module.exports = {
    name: 'userinfo',
    aliases: ['ui'],
    category: 'modmail',
    description: "Get ticket user's info.",
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
        const getMember = await User.findOne({channel: message.channel.id})
        let guild = message.guild
        let member = message.guild.members.cache.get(getMember.user)
        var memberRoles = ""
        if (member.roles.cache.size === 1) var memberRoles = "This user has no role"
        else {
            var memberRoles = member.roles.cache
            .filter((roles) => roles.id !== guild.id)
            .map((role) => role.toString());
        }
        const userInfoEmbed = new EmbedBuilder()
        .setColor(colors.base)
        .setAuthor({name: `${member.user.tag}`, iconURL: member.user.avatarURL({ size: 1024, dynamic: false })})
        .setDescription(`**Username/Discrim:** \n\`\`\`${member.user.tag}\`\`\`\n\n**User ID:** \`\`\`${member.id}\`\`\`\n\n**Member Roles:**\n${memberRoles}\n\n**Account Creation Date:** \`\`\`${moment(member.user.createdAt).format('DD.MM.YYYY LTS Z')}\`\`\``)
        message.channel.send({embeds: [userInfoEmbed]})
    }
}