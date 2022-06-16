const { settings, colors, modmail } = require("./config");
const { MessageEmbed, Permissions } = require("discord.js");
const mongoose = require("mongoose");
const {User, Channel} = require("./Utils/dbSchema")

module.exports = async (client) => {
    
    
    client.on("messageCreate", async message => {
        //Block bots and mentions
        if (message.author.bot) return;
        if (message.content.includes("@everyone") || message.content.includes("@here")) return message.author.send("You're not allowed to use those mentions.")
        let findUser = await User.findOne({user: message.author.id})

        if (!message.guild) {
            //Get guild and category from the Discord
            let guild = await client.guilds.fetch(modmail.guildId)
            let category = await guild.channels.fetch(modmail.category)
            let log = await guild.channels.fetch(modmail.log)
                if (!findUser || findUser.ticket !== true && findUser.blacklist === false) {
                    //Create new channel
                    let channel = await guild.channels.create(`${message.author.username}`, {
                        type: "GUILD_TEXT",
                        topic: `User: ${message.author.tag}(${message.author.id})`,
                        parent: category,
                        permissionOverwrites: [
                            {id: guild.roles.everyone, deny: ["VIEW_CHANNEL"]},
                           {id: guild.roles.cache.get(modmail.modRole), allow: [
                                "VIEW_CHANNEL",
                                "SEND_MESSAGES",
                                "EMBED_LINKS",
                                "READ_MESSAGE_HISTORY"
                            ]},
                          ]
                    });
                    let channelData = new Channel({userId: message.author.id, channelId: channel.id})
                    await channelData.save();
                    let UserData = new User({user: message.author.id, channel: channel.id, ticket: true})
                    await UserData.save();
                    //Send New Ticket info
                    const newTicket = new MessageEmbed()
                    .setAuthor({name: `${message.author.username}`, iconURL: message.author.avatarURL({ size: 1024, dynamic: false })})
				    .setDescription(`New ticket #${message.author.id}.`)
				    .setTimestamp()
    				.setColor(colors.positive)
                    log.send({embeds: [newTicket]})
                    message.author.send({embeds: [newTicket]})
                    const ticketInfoEmbed = new MessageEmbed()
                    .setTitle("New Ticket")
                    .setColor(colors.positive)
                    .setDescription("Type a message in this channel to reply. Messages starting with the server prefix ! are ignored, and can be used for staff discussion. Use the command !close [reason] to close this ticket.")
                    .addField("User", `${message.author} (${message.author.id})`, true)
                    .setFooter({text: `${message.author.tag} | (${message.author.id})`, iconURL: message.author.avatarURL({ size: 1024, dynamic: false })})
                    await channel.send({embeds: [ticketInfoEmbed]})
                    await channel.send({content: message.content})
                    return;
                } 
                const userBlackListedEmbed = new MessageEmbed()
                .setTitle("Ops")
                .setDescription("That server has blacklisted you from sending a message there.")
                .setColor(colors.red)
                if (findUser.blacklist === true) return message.author.send({embeds: [userBlackListedEmbed]})
                const userMessageReceivedEmbed = new MessageEmbed()
                .setTitle("Message Received")
                .setDescription(message.content)
                .setAuthor({name: `${message.author.username}`, iconURL: message.author.avatarURL({ size: 1024, dynamic: false })})
                .setColor(colors.negative)
                .setTimestamp();
                await guild.channels.cache.get(findUser.channel).send({embeds: [userMessageReceivedEmbed]})
                return;
            }
            //Mod side
            let channel = await Channel.findOne({channel: message.channel.id})
            if (!channel) return;
            let user = await User.findOne({user: channel.userId})
            let author = await client.users.fetch(user.user)
            //Check user blacklisted
            let isBlocked = user.blacklist;
            const blackListedEmbed = new MessageEmbed()
            .setTitle("Ops")
            .setDescription("That user is blacklisted on this server so you can't send messages.")
            .setColor(colors.red)
            //if (isBlocked === true) return message.channel.send({embeds: [blackListedEmbed]})
            //İf message start with prefix message ignored
            if (message.content.startsWith(settings.prefix)) return;
            const messageReceivedEmbed = new MessageEmbed()
            .setTitle("Message Received")
            .setDescription(message.content)
            .setAuthor({name: `${message.author.tag}`, iconURL: message.author.avatarURL({ size: 1024, dynamic: false })})
            .setColor(colors.negative)
            .setTimestamp();
            await author.send({embeds: [messageReceivedEmbed]})
   })
}