const { SlashCommandBuilder, SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const { VoiceManager } = require('discord-voice');
const db = require('quick.db');
const ms = require('ms');
const fs = require('fs');
 
module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Affiche le classement en fonction du paramètre sélectionné')
        .addSubcommand(subcommand =>
            subcommand
            .setName('voctime')
            .setDescription('Affiche le classement en fonction du temps passé en vocal'))
        .addSubcommand(subcommand =>
            subcommand
            .setName('messages')
            .setDescription('Affiche le classement en fonction du nombre de messages envoyés')),

        /**
        * @param {CommandInteraction} interaction 
        * @param {Client} client
        */

        async execute(client, interaction) {
            await interaction.guild.members.fetch();
            const users = interaction.guild.members.cache.filter(member => !member.user.bot);

            function msToTime(duration) {
                if (duration === 0) {
                    return `N'est pas allé en voc depuis 2021`;
                }
                var s = Math.floor((duration / 1000) % 60),
                  m = Math.floor((duration / (1000 * 60)) % 60),
                  h = Math.floor((duration / (1000 * 60 * 60)) % 24);
                  d = Math.floor(duration / (1000 * 60 * 60 * 24))
              
                  var dDisplay = d > 0 ? d + (d == 1 ? " jour, " : " jours, ") : "";
                  var hDisplay = h > 0 ? h + (h == 1 ? " heure, " : " heures, ") : "";
                  var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes et ") : "";
                  var sDisplay = s > 0 ? s + (s == 1 ? " seconde" : " secondes") : "";
              
                return dDisplay + hDisplay + mDisplay + sDisplay;
              }

            if (interaction.options.getSubcommand() === 'voctime') {
                const manager = require('../index.js');
                const voctimeData = users.map(user => {
                    let userData = manager.users.find((u) => u.userId === user.id);
                    if (!userData) {
                        const voctime = 0;
                        return { id: user.id, username: user.user.username, voctime};
                    } else {
                        const voctime = userData.voiceTime.total;
                        return { id: user.id, username: user.user.username, voctime};
                    }
                });
    
                voctimeData.sort((a, b) => b.voctime - a.voctime);
    
                const embed = new MessageEmbed()
                    .setTitle(`Top 10 des utilisateurs par temps passé en vocal`)
                    .setColor('#0099ff');
                
                voctimeData.slice(0, 10).forEach((user, i) => {
                    embed.addField(`${i + 1}. ${user.username}`, `${msToTime(user.voctime)}`);
                });
    
                return interaction.reply({ embeds: [embed] });
            } else if (interaction.options.getSubcommand() === 'messages') {
                const messagesData = users.map(user => {
                    const messages = db.fetch(`guildMessages_${interaction.guild.id}_${user.id}`) || 0;
                    return { id: user.id, username: user.user.username, messages};
                });
    
                messagesData.sort((a, b) => b.messages - a.messages);
    
                const embed = new MessageEmbed()
                    .setTitle(`Top 10 des utilisateurs par nombre de messages envoyés`)
                    .setColor('#0099ff');
                
                messagesData.slice(0, 10).forEach((user, i) => {
                    embed.addField(`${i + 1}. ${user.username}`, `${user.messages} messages`);
                });
    
                return interaction.reply({ embeds: [embed] });
            }
        }
}