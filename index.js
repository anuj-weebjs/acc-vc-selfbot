const { Client } = require('discord.js-selfbot-v13');
const { joinVoiceChannel } = require("@discordjs/voice");
const express = require('express');
const port = process.env.PORT || 4000;

const client = new Client({ checkUpdate: false });

require('dotenv').config();
const token = process.env.TOKEN;
const guildId = process.env.GUILD_ID;
const channelId = process.env.CHANNEL_ID;
const spamChannelId = process.env.Spam_CHANNEL_ID;

const app = express();
app.get("/", (req, res) => {
    res.status(200).send({
        success: "true"
    });
});
app.listen(port);



client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    await joinVC(client);
    const _channel = await client.channels.cache.get(spamChannelId);

    
function getRandomInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function spam() {
    const result = Math.random().toString(36).substring(2, 15);
    _channel.send(result)
    const randomInterval = getRandomInterval(1500, 5000); // Random interval for spam between 1 second and 5 seconds
    setTimeout(spam, randomInterval);
}
spam();

});


client.login(token);
async function joinVC(client) {
    const guild = client.guilds.cache.get(guildId);
    const voiceChannel = guild.channels.cache.get(channelId);
    const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator,
        selfDeaf: false,
        selfMute: false
    });
}

