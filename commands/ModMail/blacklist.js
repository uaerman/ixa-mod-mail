const { settings, colors, modmail } = require('../../config')
const {MessageEmbed} = require("discord.js")
const {User, Channel} = require("../../Utils/dbSchema")
module.exports = {
    name: 'blacklist',
    aliases: [],
    category: 'modmail',
    description: 'Adds a user to the blacklist',
    async execute(client, message, args) {
        let member = message.mentions.users.first()
        let guild = message.guild
        let log = guild.channels.cache.get(modmail.log)
        const invalidArgs = new MessageEmbed()
        .setTitle("Invalid Arguments")
        .setColor(colors.negative)
        .setDescription("Please check the command usage below.")
        .addField("Usage", `\`\`\`${settings.prefix}blacklist <member> \`\`\``)
        const invalidUser = new MessageEmbed()
        .setTitle("Invalid User")
        .setColor(colors.negative)
        .setDescription("You cannot add this user to the blacklist.")
        if (!member) return message.channel.send({embeds: [invalidArgs]})
        if (member.bot) return message.channel.send({embeds: [invalidUser]})
        if (message.guild.members.cache.get(member.id).permissions.has("ADMINISTRATOR")) return message.channel.send(invalidUser)
        const profileData = await User.findOne({user: member.id})
        if (!profileData) {
            let userProfile = User.create({
                channel: "0",
                user: member.id,
                blacklist: true
            })
        }
        else if (profileData.blacklist == true) {
            const failed = new MessageEmbed()
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
        const success = new MessageEmbed()
        .setTitle("Action Successful")
        .setDescription(`The user you specified has been added to the blacklist.`)
        .setColor(colors.positive)
        message.channel.send({embeds: [success]})
        const successLog = new MessageEmbed()
        .setTitle("User Blacklisted")
        .setDescription(`<@${message.author.id}> added the <@${member.id}> to the blacklist.`)
        .setColor(colors.red)
        log.send({embeds: [successLog]})        
        return;
    }
}