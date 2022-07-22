const { settings, colors, modmail } = require('../../config')
const {EmbedBuilder} = require("discord.js")
const {User, Channel} = require("../../Utils/dbSchema")
module.exports = {
    name: 'close',
    aliases: ['c'],
    category: 'modmail',
    description: 'Close Ticket',
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
    
        var reason = "";   
        let reasonArgs = args.slice(0).join(' ');
        if (!reasonArgs) var reason = "No reason was provided.";
        else var reason = `Reason: ${reasonArgs}`;
     
        if (userData.blacklist == true) {
            const blackListClosed = new EmbedBuilder()
                .setTitle("Blacklisted Ticket Closed")
                .setAuthor({name: `${message.author.tag} | (${message.author.id})`, iconURL: message.author.avatarURL({size: 1024, dynamic: false})})
                .setDescription("The ticket of a Blacklisted user has been closed. This user will not open a ticket again.")
                .setColor("RED")
                .setTimestamp()
                .setFooter({text: `${userData.user}`, iconURL: client.users.cache.get(userData.user).avatarURL({size: 1024, dynamic: false})})
            client.channels.cache.get(modmail.log).send({embeds: [blackListClosed]}) 
            message.channel.delete();
            const dataRemove = await Channel.findOneAndRemove({userId: userData.user})
            const change = await User.findOneAndUpdate({ userID: userData.user}, { $set: {ticket: false} }, {new: true})
            return;
        }
        else {
            
            const ticketClosed = new EmbedBuilder()
                .setTitle("Ticket Closed")
                .setAuthor({name: `${message.author.tag} | (${message.author.id})`, iconURL: message.author.avatarURL({size: 1024, dynamic: false})})
                .setColor(colors.negative)
                .setDescription(reason)
                .setTimestamp()
                .setFooter({text: `${userData.user}`, iconURL: client.users.cache.get(userData.user).avatarURL({size: 1024, dynamic: false})})
            message.channel.delete();
            client.channels.cache.get(modmail.log).send({embeds: [ticketClosed]}) 
            client.users.cache.get(userData.user).send({embeds: [ticketClosed]})        
            const dataRemove = await Channel.findOneAndRemove({userId: userData.user})
            const change = await User.findOneAndRemove({user: userData.user})
            return;
        }
    }
}