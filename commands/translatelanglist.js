const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton, Message } = require("discord.js");
const ms = require("ms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("translatelanglist")
    .setDescription(
      "Donne la liste des langues dispos à la traduction ainsi que leurs préfixes."
    ),

  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   * @param {Message} message
   */

  async execute(client, interaction, message) {
    const { MessageEmbed } = require('discord.js');

    const languages = {
      "BG": "Bulgarian",
      "CS": "Czech",
      "DA": "Danish",
      "DE": "German",
      "EL": "Greek",
      "EN-GB": "English (British)",
      "EN-US": "English (American)",
      "EN": "English",
      "ES": "Spanish",
      "ET": "Estonian",
      "FI": "Finnish",
      "FR": "French",
      "HU": "Hungarian",
      "IT": "Italian",
      "JA": "Japanese",
      "LT": "Lithuanian",
      "LV": "Latvian",
      "NL": "Dutch",
      "PL": "Polish",
      "PT-PT": "Portuguese (Portugal)",
      "PT-BR": "Portuguese (Brazilian)",
      "RO": "Romanian",
      "RU": "Russian",
      "SK": "Slovak",
      "SL": "Slovenian",
      "SV": "Swedish",
      "ZH-CN": "Chinese (Simplified)",
      "ZH-TW": "Chinese (Traditional)"
    };

    function createFirstPage() {
      const embed = new MessageEmbed()
        .setTitle('Liste des langues du traducteur et leur préfixe')
        .setColor('#0099ff')
        .setFooter(`Page 1/2`);

      let fields = [];
      Object.keys(languages).forEach((key, i) => {
        if (i < 18) {
          fields.push({
            name: `${key}`,
            value: `${languages[key]}`,
            inline: true
          });
        }
      });

      embed.addFields(fields);
      return embed;
    }

    function createSecondPage() {
      const embed = new MessageEmbed()
        .setTitle('Liste des langues du traducteur et leur préfixe')
        .setColor('#0099ff')
        .setFooter(`Page 2/2`);

      let fields = [];
      Object.keys(languages).forEach((key, i) => {
        if (i >= 18) {
          fields.push({
            name: `${key}`,
            value: `${languages[key]}`,
            inline: true
          });
        }
      });

      embed.addFields(fields);
      return embed;
    }

    function createPaginationButtons(page, maxPage) {
      const previousButton = new MessageButton()
        .setCustomId('previous')
        .setStyle('PRIMARY')
        .setLabel('Précédent')
        .setDisabled(page === 1);
    
      const nextButton = new MessageButton()
        .setCustomId('next')
        .setStyle('PRIMARY')
        .setLabel('Suivant')
        .setDisabled(page === maxPage);
    
      const buttonRow = new MessageActionRow()
        .addComponents(previousButton, nextButton);
    
      return buttonRow;
    }

    const firstPage = createFirstPage();
    const secondPage = createSecondPage();
    const maxPage = 2;
    let currentPage = 1;

    const paginationButtons = createPaginationButtons(currentPage, maxPage);

    return interaction.reply('Voici la liste des langues disponibles à la traduction.')
    .then(interaction.channel.send({ embeds: [firstPage], components: [paginationButtons] })
      .then(msg => {
        const messageCollector = msg.createMessageComponentCollector({
          filter: i => i.customId === 'previous' || i.customId === 'next',
          time: 60000,
          dispose: true
        });

        messageCollector.on('collect', async i => {
          if (i.customId === 'previous') {
            if (currentPage > 1) {
              currentPage--;
            }
          } else if (i.customId === 'next') {
            if (currentPage < maxPage) {
              currentPage++;
            }
          }

          const newPageEmbed = currentPage === 1 ? firstPage : secondPage;
          const newPaginationButtons = createPaginationButtons(currentPage, maxPage);

          await i.update({ embeds: [newPageEmbed], components: [newPaginationButtons] });
        });

        messageCollector.on('end', collected => {
          paginationButtons.components.forEach(button => button.setDisabled(true));
          msg.edit({ components: [paginationButtons] });
        });
      }));
  },
};
