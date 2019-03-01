//TODO: --> implement meme.js
//      --> implement audio.js
//      --> implement help.js

const http = require('http'); 
const express = require('express'); 
const app = express();
app.get("/", (request, response) => {
  //console.log(" -------------------------");
  //console.log(" " + Date.now() + " Ping Received");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280);  


const nsfw = require('./nsfw.js');
const util = require('./utility.js');
const cmd = require('./commands.js');

// Load up the discord.js library
const Discord = require("discord.js");

// This is your client. Some people call it `bot`, some people call it `self`, 
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client({
  token: process.env.TOKEN, 
  autorun: true
}); 
// Here we load the config.json file that contains our token and our prefix values. 
const config = require("./config.json"); 
// config.prefix contains the message prefix.



client.on("ready", () => { 
  const keys = client.channels.keyArray();
  
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
                          
  console.log(" -------------------------");
  console.log(" Voice Channels:"); util.data.listVoiceChannels(client.channels,keys);
   
  console.log(" -------------------------");
  console.log(" Setting Activity:"); util.data.changeActivity(client);
  
  nsfw.data.init();
}); 

client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("message", async message => {
  if(message.author.bot) return;// anti-loop, ignores bots
  if(message.content.indexOf(config.prefix) === 0){
    console.log(" -------------------------");
    console.log(" Input:"); 
    cmd.data.main(message,client,config);
  } else if(message.content.indexOf(config.prefix2) === 0){ 
    console.log(" -------------------------");
    console.log(" Input:");
    nsfw.data.main(message,client,config);
  } else return;
});

client.login(process.env.TOKEN);  