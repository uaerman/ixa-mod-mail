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
                //New ticket
                if (!findUser || findUser.ticket === false && findUser.blacklist === false) {
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
                    //Save channel and user data to database
                    let channelData = new Channel({userId: message.author.id, channelId: channel.id})
                    await channelData.save();
                    let UserData = new User({user: message.author.id, channel: channel.id, ticket: true})
                    await UserData.save();
                    //Send New Ticket info to logs and user
                    const newTicket = new MessageEmbed()
                    .setAuthor({name: `${message.author.username}`, iconURL: message.author.avatarURL({ size: 1024, dynamic: false })})
				    .setDescription(`New ticket #${message.author.id}.`)
				    .setTimestamp()
    				.setColor(colors.positive)
                    log.send({embeds: [newTicket]})
                    message.author.send({embeds: [newTicket]})
                    //New ticket info for mods
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
                //If user alredy has ticket 
                let userBlocked = findUser.blacklist;
                let channelHold = findUser.hold
                const userBlackListedEmbed = new MessageEmbed()
                .setTitle("Ops")
                .setDescription("That server has blacklisted you from sending a message there.")
                .setColor(colors.red)
                //If user blacklisted
                if (findUser.blacklist === true) return message.author.send({embeds: [userBlackListedEmbed]})
                const channelHoldEmbed = new MessageEmbed()
                .setTitle("Ops")
                .setDescription("Mods are holding your ticket, they will return as soon as possible.")
                .setColor(colors.negative)
                //If channel hold by mods
                if (findUser.hold === true) return message.author.send({embeds: [channelHoldEmbed]})
                const userMessageReceivedEmbed = new MessageEmbed()
                .setTitle("Message Received")
                .setDescription(message.content)
                .setAuthor({name: `${message.author.username}`, iconURL: message.author.avatarURL({ size: 1024, dynamic: false })})
                .setColor(colors.negative)
                .setTimestamp();
                //Else send message ticket channel
                await guild.channels.cache.get(findUser.channel).send({embeds: [userMessageReceivedEmbed]})
                return;
            }
            //Mod side
            let channel = await Channel.findOne({channel: message.channel.id})
            if (!channel) return;
            let user = await User.findOne({user: channel.userId})
            let author = await client.users.fetch(user.user)
            let isBlocked = user.blacklist;
            let isHold = user.hold;
            //Check user blacklisted
            //If user blacklisted ignore all messages
            if (isBlocked === true) return;
            //If message start with prefix message ignored
            if (message.content.startsWith(settings.prefix)) return;
            //If ticket is hold ignore message
            if (isHold === true) return;
            //Else send message to user
            const messageReceivedEmbed = new MessageEmbed()
            .setTitle("Message Received")
            .setDescription(message.content)
            .setAuthor({name: `${message.author.tag}`, iconURL: message.author.avatarURL({ size: 1024, dynamic: false })})
            .setColor(colors.negative)
            .setTimestamp();
            await author.send({embeds: [messageReceivedEmbed]})
   })
}