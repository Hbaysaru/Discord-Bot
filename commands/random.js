const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, CommandInteraction } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('random')
        .setDescription('Donne un chiffre aléatoire entre 1 et le maximum donné')
        .addNumberOption(option =>
            option.setName('maximum')
            .setDescription('Quel est le maximum ?')
            .setRequired(true)),

    /**
    * @param {CommandInteraction} interaction 
    * @param {Client} client
    */

    async execute(client, interaction) {
        const max = interaction.options.getNumber('maximum');
        const Numb = Number(max);
        const randomNumber = Math.floor(Math.random() * Numb) + 1;

        return interaction.reply(String(randomNumber));
    }
}
