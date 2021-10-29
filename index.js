const fs = require('fs');
const { Client, Collection, Intents, Message, } = require('discord.js');
const { token } = require('./config.json');
const db = require('quick.db');
const { VoiceManager } = require('discord-voice');

const handleCommand = require('./helpers/command');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_INVITES, Intents.FLAGS.GUILD_VOICE_STATES]});
const manager = new VoiceManager (client, {
    userStorage: "./db/users.json",
    configStorage: "./db/configs.json",
    checkMembersEvery: 1000,
    default: {
        trackAllChannels: true,
		trackMute: false,
        trackDeaf: false,
		voiceTimeToAdd: new Function('return 1000;'),
		voiceTimeTrackingEnabled: true
    }
});
module.exports = manager;

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'))

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
};

client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (interaction.isCommand()) handleCommand(client, interaction);
});

client.on('messageCreate', message => {
	db.add(`guildMessages_${message.author.id}`, 1);
	// Penser à changer la database pour sauvegarder données quand le bot est éteint ?
});

client.on('guildMemberAdd', member => {
	member.roles.add('roleId');
 }); 

client.login(token);
