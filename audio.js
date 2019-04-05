//fix stream interruption with isPlaying
 
const ytdl = require('ytdl-core'); 
const util = require('./utility.js');
const bot = require('./bot.js');
const dtaInter = require('./dataInterface.js');
const streamOptions = { seek: 0, volume: 1 };
require('isomorphic-fetch');  

var Connection, dispatcher, isPlaying; 

var methods = {
  init : async function(channels){
    let dta = dtaInter.data.read(); 
    let channelID = dtaInter.data.getItem(['Var','audio','channelID'],dta); 
    let serverID = dtaInter.data.getItem(['Var','audio','serverID'],dta); 
    
    if(channelID != ""){
      const channel = channels.find(x => x.id === channelID);
      await methods.connect(channel);
    } else {
      Connection == undefined;
    }
    
    isPlaying = dtaInter.data.getItem(['Var','audio','isPlaying'],dta); 
    
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
      Connection.channel.leave();
      Connection = undefined;
      dtaInter.data.update("",['Var','audio','serverID'],dtaInter.data.read(),'set',function(){return true;}) 
      dtaInter.data.update("",['Var','audio','channelID'],dtaInter.data.read(),'set',function(){return true;}) 
      dtaInter.data.update(false,['Var','audio','isPlaying'],dtaInter.data.read(),'set',function(){return true;}) 
    }
  },
  connect : function(channel){
    return channel.join().then(connection => Connection = connection); 
  },
  play :async function(channel,res,bool){ 
    if(channel == undefined) return;
    let stream = await methods.createStream(res,bool);
    //console.log(channel.guild.id + ' ' + channel.id); 
    if(Connection == undefined){ 
      await methods.connect(channel); 
      dtaInter.data.update(channel.guild.id,['Var','audio','serverID'],dtaInter.data.read(),'set',function(){return true;}) 
      dtaInter.data.update(channel.id,['Var','audio','channelID'],dtaInter.data.read(),'set',function(){return true;})
      dtaInter.data.update(true,['Var','audio','isPlaying'],dtaInter.data.read(),'set',function(){return true;}) 
    } 
    dispatcher = Connection.playStream(stream,streamOptions);   
    
    dispatcher.on("end", async function(end){
      await util.data.sleep(5*60000); 
      channel.leave(); Connection = undefined; 
      dtaInter.data.update("",['Var','audio','serverID'],dtaInter.data.read(),'set',function(){return true;}) 
      dtaInter.data.update("",['Var','audio','channelID'],dtaInter.data.read(),'set',function(){return true;}) 
      dtaInter.data.update(false,['Var','audio','isPlaying'],dtaInter.data.read(),'set',function(){return true;}) 
    });  
  }
}

function main(channel,res){

}

function play(){
  
}
exports.data = methods; 
exports.main = main;
exports.play = play;