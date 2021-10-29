const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, CommandInteraction } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Renvoie le nombre de ping'),
    /**
    * @param {CommandInteraction} interaction 
    * @param {Client} client
    */
    async execute(client, interaction) {
        const ping = interaction.client.ws.ping

        return interaction.reply(`Ton ping est de ${ping} ms.`);
    }
}