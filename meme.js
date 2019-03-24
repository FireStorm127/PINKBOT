const audio = require('./audio.js');
const dtaInter = require('./dataInterface.js');
const util = require('./utility.js');
const config = require("./config.json");
const Discord = require('discord.js');

var collector, cmd, prop, index;
var pathCmds = ['Cmds','meme']; 
var pathVar = ['Var','meme'];

var methods = {
  awaitBool: async function(time){
    await util.data.sleep(time*60000);
    dtaInter.data.update(false,pathVar.concat('bool'),dtaInter.data.read(),'set',function(){return true;}); 
  },
  identifyType(url){
    let prop, format;
    let identifiers = ['y','a','g']; // g> graphic  a> audio  y> youtube video

    format  = url.split('/'); let address = 'www.youtube.com';
    let prom = format.find(function(element){
      return element == address;
    });
    prom == address ? prop = util.data.push([url],identifiers[0]) : prop; 
    if(prop == undefined) {
      format = url.split('.').pop();
      ((format == 'mp3' || format == 'webm') && prop == undefined) ? prop = util.data.push([url],identifiers[1]) : prop = util.data.push([url],identifiers[2]);
    }
    return prop;
  },
  new: function(msg,args,client){//delete msg.reply...
    cmd = args[0]; prop; index = util.data.arrayFind(cmd,dtaInter.data.getItem(pathCmds,dtaInter.data.read())); let bool = index != -1; 
    bool ? msg.reply('this command already exists, send new file or link to change it.') : msg.reply('send file or link of the meme.');
    
    methods.awaitBool(1);
    collector.on("collect", message => {
      if(message.author.bot) return;
      if(message.content.indexOf(config.prefix) === 0) return;
      if(dtaInter.data.getItem(pathVar.concat('bool'),dtaInter.data.read())){
        message.attachments.first() != undefined ? prop = methods.identifyType(message.attachments.first().url) : prop = methods.identifyType(message.content);
        
        collector.stop; 
        
        if(prop[0].split('/')[0] == "https:" || prop[0].split('/')[0] == "http"){
          console.log(" -------------------------");
          bool ? console.log(' Changing meme:') : console.log(' Added new meme:');
          console.log(' - Cmd: ' + cmd); console.log(' - Url: ' + prop[0]); console.log(' - Format: ' + prop[1]);
          
          dtaInter.data.update(false,pathVar.concat('bool'),dtaInter.data.read(),'set',function(){return true;});
          if(bool){
            let array = dtaInter.data.getItem(pathVar.concat('link'),dtaInter.data.read());
            array[index] = prop[0]; dtaInter.data.update(array,pathVar.concat('link'),dtaInter.data.read(),'set',function(){return true;});
            array = dtaInter.data.getItem(pathVar.concat('type'),dtaInter.data.read());
            array[index] = prop[1]; dtaInter.data.update(array,pathVar.concat('type'),dtaInter.data.read(),'set',function(){return true;});
          } else {
            dtaInter.data.update(cmd,pathCmds,dtaInter.data.read(),'add',function(){return true;});
            dtaInter.data.update(prop[0],pathVar.concat('link'),dtaInter.data.read(),'add',function(){return true;});
            dtaInter.data.update(prop[1],pathVar.concat('type'),dtaInter.data.read(),'add',function(){return true;});
          }; msg.channel.send('Done');
        } else {
           msg.reply('not a valid attachment !'); 
        }
      }
    });
  },
  removeMeme : function(message,args,obj){
    let target = args[0]
    if(target == undefined) message.channel.send('??????? btw its `$$remove <meme_name>`.');
    let i = util.data.arrayFind(target,dtaInter.data.getItem(pathCmds,obj));
    if(i == -1){ 
      message.channel.send(`target` + ' is not in the database !');
    }else{
      let link = dtaInter.data.getItem(pathVar.concat('link'),obj) , type = dtaInter.data.getItem(pathVar.concat('type'),obj);
      dtaInter.data.update(target,pathCmds,dtaInter.data.read(),'remove',function(){return true;});
      dtaInter.data.update(link[i],pathVar.concat('link'),dtaInter.data.read(),'remove',function(){return true;});
      dtaInter.data.update(type[i],pathVar.concat('type'),dtaInter.data.read(),'remove',function(){return true;});}
  },
  sendMeme: function(message,index,obj){
    let type = dtaInter.data.getItem(pathVar.concat('type'),obj); let url = dtaInter.data.getItem(pathVar.concat('link'),obj)[index]; 
    type[index] == 'g' ? util.data.sendImageLink(url,message,undefined,true) : (type[index] == 'y' ? audio.data.play(message.member.voiceChannel,url,true) : audio.data.play(message.member.voiceChannel,url,false));
  },
  main : function(message,command,args,client){
    let dta = dtaInter.data.read();
    
    switch(command){
      case 'new':
        dtaInter.data.update(true,pathVar.concat('bool'),dta,'set',function(){return true;});
        collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, {time: 60000});
        methods.new(message,args,client);
        break;
      case 'memes':
        let list = dta.Cmds.meme, i = dta.Var.meme.newIndex, string = 'here are the memes: \n';
        list = list.slice(i);
        for(var j of list){
          string+= ' - **' + j +'**\n';
        }
        message.reply(string + 'To add a new meme use command  `$$new <meme_name>`');
        break;
      case 'remove':
        methods.removeMeme(message,args,dta);   
        break;
      default:
        let cmds = dtaInter.data.getItem(pathCmds,dta); let error = dtaInter.data.getItem(pathVar.concat('newIndex'),dta); let ind = util.data.arrayFind(command,cmds)
        ind != -1 ? methods.sendMeme(message,ind-error,dta) : message.reply('not found in the database, to add a new meme use ` $$new <meme_name> `.');
    }
  }
};

exports.data = methods;