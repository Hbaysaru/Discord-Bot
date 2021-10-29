const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, CommandInteraction } = require('discord.js');
const { VoiceManager } = require('discord-voice');
const db = require('quick.db');
const ms = require('ms');
 
module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription("Permet de savoir les statistiques d'un utilisateur")
        .addUserOption(option =>
            option.setName('target')
            .setDescription("Qui t'intéresse ?")
            .setRequired(false)),

        /**
        * @param {CommandInteraction} interaction 
        * @param {Client} client
        */

        async execute(client, interaction) {
            const manager = require('../index.js');

            const targetmember = interaction.options.getUser('target') || interaction.member;

            const GMessages = await db.fetch(`guildMessages_${targetmember.id}`);

            let userData = manager.users.find((u) => u.userId === targetmember.id);
            if (!userData) {
                return interaction.reply(`**Nombre de messages envoyés sur le serveur :** \`${GMessages}\`\n**Temps passé en vocal :** Fin faut aller en voc en fait...`);
            } else {
                return interaction.reply(`**Nombre de messages envoyés sur le serveur :** \`${GMessages}\`\n**Temps passé en vocal :** \`${ms(userData.voiceTime.total, {long: true})}\``);
            }
        }
}