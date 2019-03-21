//TODO: --> implement meme.js
//      --> implement audio.js
//      --> implement help.js

const http = require('http'); 
const express = require('express'); 
const app = express();
app.get("/", (request, response) => {
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280);  

const fs = require('fs');
const DATA = require('./dataInterface.js');
const nsfw = require('./nsfw.js');
const util = require('./utility.js');
const cmd = require('./commands.js');
const Discord = require('discord.js');

const client = new Discord.Client({
  token: process.env.TOKEN, 
  autorun: true
}); 
const config = require("./config.json"); 

client.on("ready", () => { 
  const keys = client.channels.keyArray();
  
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  console.log(" -------------------------");
  console.log(" Voice Channels:"); util.data.listVoiceChannels(client.channels,keys);
  console.log(" -------------------------");
  console.log(" Setting Activity:"); util.data.changeActivity(client);

  nsfw.data.init(client); 
}); 

client.on("guildCreate", guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
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
    channel.send(`Thanks for inviting me into this server!`);
});

client.on("guildDelete", guild => {
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
});

client.on("message", async message => {
  if(message.author.bot) return;
  if(message.content.indexOf(config.prefix) === 0){ 
    console.log(" -------------------------");
    console.log(" Input:"); 
    cmd.data.main(message,client,config);
  } else if(true){ 
  } else return;
});

client.login(process.env.TOKEN);  

var oof = function (item,path,action,obj,acc){
  let key = path[0];
  if(path.length == 1){
    switch (action){
      case 'set':
        obj[key] = item;
        break;
      case 'add':
        let temp = obj[key];
        obj[key] = (typeof(temp) === typeof([]) ? push(temp,item) : new Array(item));  //define new push --> array.push(['...','...']) ==> [...,['...','...']]
        break;
      case 'remove':
        let temp2 = obj[key];
        typeof(temp2) === typeof([]) ? (typeof(temp2.indexOf(item)) === typeof(1) ? temp2.splice(temp2.indexOf(item),1) : temp2) : temp2;
        obj[key] = temp2;
        break;
    }
    return acc;
  }else{
    return oof(item,path.slice(1),action,obj[key],acc);
  }
};
function push(array,item){
  array[array.length] = item
  return array;
};
    
 