const { settings, colors, modmail } = require('../../config')
const {MessageEmbed} = require("discord.js")
const {User, Channel} = require("../../Utils/dbSchema")
module.exports = {
    name: 'whitelist',
    aliases: [],
    category: 'modmail',
    description: 'Remove a user from blacklist.',
    async execute(client, message, args) {
        let member = message.mentions.users.first()
        let guild = message.guild
        let log = guild.channels.cache.get(modmail.log)
        const invalidArgs = new MessageEmbed()
        .setTitle("Invalid Arguments")
        .setColor(colors.negative)
        .setDescription("Please check the command usage below.")
        .addField("Usage", `\`\`\`${settings.prefix}whitelist <member> \`\`\``)
        const invalidUser = new MessageEmbed()
        .setTitle("Invalid User")
        .setColor(colors.negative)
        .setDescription("You cannot add this user to the whitelist.")
        if (!member) return message.channel.send({embeds: [invalidArgs]})
        if (member.bot) return message.channel.send({embeds: [invalidUser]})
        if (message.guild.members.cache.get(member.id).permissions.has("ADMINISTRATOR")) return message.channel.send(invalidUser)
        const profileData = await User.findOne({user: member.id})
        if (!profileData) {
           const failed = new MessageEmbed()
            .setTitle("Action Failed")
            .setDescription(`This user is already whitelisted.`)
            .setColor(colors.negative)
            message.channel.send({embeds: [failed]})
            return;
        }
        else if (profileData.blacklist == false) {
            const failed = new MessageEmbed()
            .setTitle("Action Failed")
            .setDescription(`This user is already whitelisted.`)
            .setColor(colors.negative)
            message.channel.send({embeds: [failed]})
            return;
        }
        else {
            const change = await User.findOneAndRemove({ userID: member.id}).catch((error) => {
                message.reply("something went wrong...")
                console.log(error)
                return;
            })
        }
        const success = new MessageEmbed()
        .setTitle("Action Successful")
        .setDescription(`The user you specified has been removed to the blacklist.`)
        .setColor(colors.positive)
        message.channel.send({embeds: [success]})
        const successLog = new MessageEmbed()
        .setTitle("User Whitelisted")
        .setDescription(`<@${message.author.id}> removed the <@${member.id}> to the blacklist.`)
        .setColor(colors.green)
        log.send({embeds: [successLog]})        
        return;
    }
}