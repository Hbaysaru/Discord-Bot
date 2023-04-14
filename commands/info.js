const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, CommandInteraction } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Donne les infos générales sur le bot'),
    /**
    * @param {CommandInteraction} interaction 
    * @param {Client} client
    */
    async execute(client, interaction) {
        const emploi = "20/11/2021";
        const màj = "01/04/2023";
        const ping = interaction.client.ws.ping;
        
        return interaction.reply(`Le bot a été mis à l'emploi le \`${emploi}\`. \nLa dernière mise à jour a été effectuée le \`${màj}\`. \nLe bot est hébergé à Dallas (US), ton ping avec le serveur du bot est de \`${ping}\` ms.`);
    }
}
