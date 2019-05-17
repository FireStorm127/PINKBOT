//fix stream interruption with isPlaying
 
const ytdl = require('ytdl-core'),
      util = require('./utility.js'),
      dtaInter = require('./dataInterface.js'),
      streamOptions = { seek: 0, volume: 1 };
require('isomorphic-fetch');  

var Connection, dispatcher, isPlaying; 

var methods = {
  init : async function(channels){
    console.log(" -------------------------");
    console.log(" Initializing audio control var:");
    
    let channelID = dtaInter.data.getData('/Var/audio/channelID'); 
    let serverID = dtaInter.data.getData('/Var/audio/serverID'); 
    isPlaying = dtaInter.data.getData('/Var/audio/isPlaying');  
    
    if(channelID != "" && channelID != undefined){
      console.log(" - Channel: " + channelID + "\n - Server: " + serverID + "\n - Playing: " + isPlaying); 
      const channel = channels.find(x => x.id === channelID);
      await methods.connect(channel);
    } else {
      console.log(" - Channel: [none]\n - Server: [none]\n - Playing: " + isPlaying); 
      Connection == undefined;
    }
  },
  createStream : async function(res,bool){
    let stream;    
    if(bool == false){
      await fetch(res)
      .then(function(response) {stream = response.body})
      .catch(err => console.log(err));
    } else {
      stream = ytdl(res, { filter : 'audioonly' });
    }
    return stream;
  },
  stop: function(message){
    if(!Connection) return;
    if(message.guild.voiceConnection.channel == Connection.channel){ 
      Connection.channel.leave(); console.log(' -------------------------\n Disconnected from '+ Connection.channel.name + ' : ' + message.guild.name);
      Connection = undefined;
      dtaInter.up(["","",false],['/Var/audio/serverID','/Var/audio/channelID','/Var/audio/isPlaying'],['set','set','set']); 
    }
  },
  connect : function(channel){
    return channel.join().then(connection => {
      console.log(" - Connected to channel: " + channel.id + " : " + channel.guild.id);
      Connection = connection
    }); 
  },
  play :async function(channel,res,bool){ 
    if(channel == undefined) return;
    let stream = await methods.createStream(res,bool);
    //console.log(channel.guild.id + ' ' + channel.id); 
    if(Connection == undefined){ 
      await methods.connect(channel); 
      dtaInter.up([channel.guild.id,channel.id,true],['/Var/audio/serverID','/Var/audio/channelID','/Var/audio/isPlaying'],['set','set','set']); 
    } 
    dispatcher = Connection.playStream(stream,streamOptions);   
    
    dispatcher.on("end", async function(end){
      await util.data.sleep(5*60000); 
      channel.leave(); Connection = undefined; console.log(' -------------------------\n Disconnected from '+ channel.name + ' : ' + channel.guild.name); 
      dtaInter.up(["","",false],['/Var/audio/serverID','/Var/audio/channelID','/Var/audio/isPlaying'],['set','set','set']); 
    });  
  }
}

exports.data = methods; 