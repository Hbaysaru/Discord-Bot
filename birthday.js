const schedule = require("node-schedule");
const Discord = require("discord.js");

module.exports = {
    scheduleBday(day, month, year, username, channelID, client) {

        var currentDate = new Date();

        var birthDate = new Date(currentDate.getFullYear(), Number(month) - 1, day);

        var j = schedule.scheduleJob(birthDate, () => {

            var channel = client.channels.cache.get(channelID);
            if (!channel) return console.log("Could not find channel");
            channel.send(`Joyeux anniversaire à <@${username}> !!!`);
        });

        return j;

    }
}
