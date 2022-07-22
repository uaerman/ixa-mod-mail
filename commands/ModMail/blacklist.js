const { settings, colors, modmail } = require('../../config')
const {EmbedBuilder} = require("discord.js")
const {User, Channel} = require("../../Utils/dbSchema")
module.exports = {
    name: 'blacklist',
    aliases: [],
    category: 'modmail',
    description: 'Adds a user to the blacklist',
    async execute(client, message, args) {
        const missingPermission = new EmbedBuilder()
        .setTitle("Permission Missing")
        .setColor(colors.negative)
        .setDescription("You do not have the necessary permissions to use this command.")
        if (!message.member.roles.cache.has(modmail.modRole)) return message.channel.send({embeds: [missingPermission]})
        let member = message.mentions.users.first()
        let guild = message.guild
        let log = guild.channels.cache.get(modmail.log)
        const invalidArgs = new EmbedBuilder()
        .setTitle("Invalid Arguments")
        .setColor(colors.negative)
        .setDescription("Please check the command usage below.")
        .addFields([{name: "Usage",value: `\`\`\`${settings.prefix}blacklist @member/<@memerID> \`\`\``}])
        const invalidUser = new EmbedBuilder()
        .setTitle("Invalid User")
        .setColor(colors.negative)
        .setDescription("You cannot add this user to the blacklist.")
        if (!member) return message.channel.send({embeds: [invalidArgs]})
        if (member.bot) return message.channel.send({embeds: [invalidUser]})
        const profileData = await User.findOne({user: member.id})
        if (!profileData) {
            let userProfile = User.create({
                channel: "0",
                user: member.id,
                blacklist: true
            })
        }
        else if (profileData.blacklist == true) {
            const failed = new EmbedBuilder()
            .setTitle("Action Failed")
            .setDescription(`This user is already blacklisted.`)
            .setColor(colors.negative)
            message.channel.send({embeds: [failed]})
            return;
        }
        else {
            const change = await User.findOneAndUpdate({ userID: member.id}, { $set: {blacklist: true } }, {new: true}).catch((error) => {
                message.reply("something went wrong...")
                console.log(error)
                return;
            })
        }
        const success = new EmbedBuilder()
        .setTitle("Action Successful")
        .setDescription(`The user you specified has been added to the blacklist.`)
        .setColor(colors.positive)
        message.channel.send({embeds: [success]})
        const successLog = new EmbedBuilder()
        .setTitle("User Blacklisted")
        .setDescription(`<@${message.author.id}> added the <@${member.id}> to the blacklist.`)
        .setColor(colors.red)
        log.send({embeds: [successLog]})
        const blacklistWarn = new EmbedBuilder()
        .setTitle("User Blacklisted")
        .setDescription(`This user blacklisted! All messages will be ignored until user back whitelist.`)
        .setColor(colors.negative)
        message.guild.channels.cache.get(profileData.channel).send({embeds: [blacklistWarn]})  
        return;
    }
}