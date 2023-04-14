const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, CommandInteraction } = require('discord.js');
const deepl = require('deepl-node');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('translate')
        .setDescription('Traduis une phrase dans une langue spécifique')
        .addStringOption(option =>
            option.setName('langue')
            .setDescription("Dans quelle langue ?")
            .setRequired(true))
        .addStringOption(option =>
            option.setName('texte')
            .setDescription("Que veux-tu traduire ")
            .setRequired(true)),

    /**
    * @param {CommandInteraction} interaction 
    * @param {Client} client
    */

    async execute(client, interaction) {

        const authKey = "730f371b-c3a7-157c-2631-dcfe0a766978:fx"
        const translator = new deepl.Translator(authKey);

        async function translate(text, targetLang) {
            try {
              const result = await translator.translateText(text, null, targetLang);
              return result;
            } catch (error) {
              console.error(error);
              return interaction.reply(`Ton préfixe de langue n'est pas être correct. \n(Liste disponible avec la commande /translatelanglist)`);
            }
          }


        const textToTranslate = interaction.options.getString('texte');
        const targetLang = interaction.options.getString('langue');       

        return translate(textToTranslate, targetLang)
        .then((translatedText) => {interaction.reply(translatedText.text)})
        .catch((error) => {console.error(error)});
    }
}