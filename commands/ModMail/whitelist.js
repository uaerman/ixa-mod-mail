const { settings, colors, modmail } = require('../../config')
const {EmbedBuilder} = require("discord.js")
const {User, Channel} = require("../../Utils/dbSchema")
module.exports = {
    name: 'whitelist',
    aliases: [],
    category: 'modmail',
    description: 'Remove a user from blacklist.',
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
        .addFields([{name: "Usage", value: `\`\`\`${settings.prefix}whitelist @member/<@memerID> \`\`\``}])
        const invalidUser = new EmbedBuilder()
        .setTitle("Invalid User")
        .setColor(colors.negative)
        .setDescription("You cannot add this user to the whitelist.")
        if (!member) return message.channel.send({embeds: [invalidArgs]})
        if (member.bot) return message.channel.send({embeds: [invalidUser]})
        const profileData = await User.findOne({user: member.id})
        if (!profileData) {
           const failed = new EmbedBuilder()
            .setTitle("Action Failed")
            .setDescription(`This user is already whitelisted.`)
            .setColor(colors.negative)
            message.channel.send({embeds: [failed]})
            return;
        }
        else if (profileData.blacklist == false) {
            message.channel.send({embeds: [failed]})
            return;
        }
        else {
            const change = await User.findOneAndUpdate({ userID: member.id}, { $set: {blacklist: false } }, {new: true}).catch((error) => {
                message.reply("something went wrong...")
                console.log(error)
                return;
            })
        }
        const success = new EmbedBuilder()
        .setTitle("Action Successful")
        .setDescription(`The user you specified has been removed to the blacklist.`)
        .setColor(colors.positive)
        message.channel.send({embeds: [success]})
        const successLog = new EmbedBuilder()
        .setTitle("User Whitelisted")
        .setDescription(`<@${message.author.id}> removed the <@${member.id}> to the blacklist.`)
        .setColor(colors.green)
        log.send({embeds: [successLog]})
        const whitelistWarn = new EmbedBuilder()
        .setTitle("User Whitelistes")
        .setDescription(`This user whitelist back! All messages will be send to user.`)
        .setColor(colors.positive)
        message.guild.channels.cache.get(profileData.channel).send({embeds: [whitelistWarn]})          
        return;
    }
}