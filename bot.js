const http = require('http'), 
      express = require('express'),
      app = express();
app.get("/", (request, response) => {
  response.sendStatus(200);
});
app.listen(process.env.PORT); 
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280);  

const fs = require('fs'),
      DATA = require('./dataInterface.js'),
      nsfw = require('./nsfw.js'),
      util = require('./utility.js'),
      cmd = require('./commands.js'),
      audio = require('./audio.js'),
      Discord = require('discord.js'),
      commando = require('discord.js-commando');

const config = require("./config.json"); 
const client = new Discord.Client({
  token: process.env.TOKEN, 
  autorun: true
}); 

client.on("ready", () => { 
  const keys = client.channels.keyArray();
  
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  console.log(" -------------------------");
  console.log(" Voice Channels:"); util.data.listVoiceChannels(client.channels,keys);
  console.log(" -------------------------");
  console.log(" Setting Activity:"); util.data.changeActivity(client);

  audio.data.init(client.channels);
  nsfw.data.init(client); 
}); 

client.on("guildCreate", guild => {
  console.log(" -------------------------");
  console.log(` New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  let channelID;
    let channels = guild.channels;
    channelLoop:
    for (let c of channels) {
        let channelType = c[1].type;
        if (channelType === "text") {
            channelID = c[0];
            break channelLoop;
        }
    }
    let channel = client.channels.get(guild.systemChannelID || channelID);
    channel.send("ey Boss, thanks for inviting me into this server!");
    channel.send({"file" : "https://cdn.glitch.com/7c0c4f6d-9b75-4956-93c5-b4361e2f3db2%2F1527117972_MajorSomberBaboon-max-1mb.gif"});
});

client.on("guildDelete", guild => {
  console.log(" -------------------------");
  console.log(` I have been removed from: ${guild.name} (id: ${guild.id})`);
});

client.on("message", async message => {
  if(message.author.bot) return;
  if(message.content.indexOf(config.prefix) === 0){ 
    console.log(" -------------------------");
    console.log(" Input:"); 
    cmd.data.main(message,client,config);
  } else return;
});

client.login(process.env.TOKEN);      

exports.client = client;
 