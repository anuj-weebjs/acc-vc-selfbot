const { Client } = require('discord.js-selfbot-v13');
const { joinVoiceChannel } = require("@discordjs/voice");
const express = require('express');
var bodyParser = require('body-parser');
const port = process.env.PORT || 4000;
var state = {
    isConnected: false,
    history:{
        guildId: null,
        channelId: null
    }

}

const client = new Client({ checkUpdate: false });

require('dotenv').config();
const token = process.env.TOKEN;
const spamChannelId = process.env.SPAM_CHANNEL_ID;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    res.render('index', {isConnected: state.isConnected, history: state?.history});
});

app.post("/join", (req, res) =>{
    let {guildId, channelId } = req.body;
    state.connection = joinVC(client, guildId, channelId);
    state.history.guildId = guildId;
    state.history.channelId = channelId;
    state.isConnected = true;
    res.redirect('/')
});

app.get("/leave", (req, res) =>{
    if(!state.connection){
        state.isConnected = false;
        res.redirect('/');
        return;
    }
    state.connection.destroy();
    state.history.guildId = null;
    state.history.channelId = null;
    state.connection = null;
    state.isConnected = false;
    res.redirect('/');
})

app.listen(port);



client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    spam();
});

client.login(token);


function getRandomInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function spam() {
    const _channel = await client.channels.cache.get(spamChannelId);
    const result = Math.random().toString(36).substring(2, 15);
    _channel.send(result)
    const randomInterval = getRandomInterval(60000, 120000);
    setTimeout(spam, randomInterval);
}

function joinVC(client, guildId, channelId) {
    const guild = client.guilds.cache.get(guildId);
    const voiceChannel = guild.channels.cache.get(channelId);
    const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator,
        selfDeaf: false,
        selfMute: false
    });
    return connection;
}

