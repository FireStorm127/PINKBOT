//ready 4 1.0

const audio = require('./audio.js'),
      dtaInter = require('./dataInterface.js'),
      util = require('./utility.js'),
      config = require("./config.json"),
      Discord = require('discord.js');

var collector, cmd, prop, index,
    pathCmds = '/Cmds/meme',
    pathVar = '/Var/meme';

var methods = {
  awaitBool: async function(time){
    await util.data.sleep(time*60000);
    dtaInter.up([false],[pathVar+'/bool'],['set']); 
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
    //let dta = dtaInter.read();
    cmd = args[0]; index = util.data.arrayFind(cmd,dtaInter.data.getData(pathCmds)); let bool = index != -1; 
    //console.log(cmd)
    bool ? msg.reply('this command already exists, send new file or link to change it.') : msg.reply('send file or link of the meme.');
    
    methods.awaitBool(1);
    collector.on("collect", message => {
      if(message.author.bot) return;
      if(message.content.indexOf(config.prefix) === 0) return;
      if(dtaInter.data.getData(pathVar+'/bool')){
        message.attachments.first() != undefined ? prop = methods.identifyType(message.attachments.first().url) : prop = methods.identifyType(message.content);
        
        collector.stop; 
        
        if(prop[0].split('/')[0] == "https:" || prop[0].split('/')[0] == "http"){
          console.log(" -------------------------");
          bool ? console.log(' Changing meme:') : console.log(' Added new meme:');
          console.log(' - Cmd: ' + cmd); console.log(' - Url: ' + prop[0]); console.log(' - Format: ' + prop[1]);
          
          dtaInter.up([false],[pathVar+'/bool'],['set']);
          if(bool){
            let error = dtaInter.data.getData(pathVar+'/newIndex');
            let array = dtaInter.data.getData(pathVar+'/link');//console.log(array)
            array[index-error] = prop[0]; dtaInter.up([array],[pathVar+'/link'],['set']);//console.log(array)
            array = dtaInter.data.getData(pathVar+'/type');
            array[index-error] = prop[1]; dtaInter.up([array],[pathVar+'/type'],['set']);
          } else {
            dtaInter.up([cmd,prop[0],prop[1]],[pathCmds,pathVar+'/link',pathVar+'/type'],['add','add','add']);
          }; msg.channel.send('Done');
        } else {
           msg.reply('not a valid attachment !'); 
        }
      }
    });
  },
  removeMeme : function(message,args){
    let target = args[0];// obj = dtaInter.read();
    if(target == undefined){
      message.channel.send('??????? btw its `$$remove <meme_name>`.');
      return;
    }
    
    let cmds = dtaInter.data.getData(pathCmds),
        error = dtaInter.data.getData(pathVar+'/newIndex'),
        index = util.data.arrayFind(target,cmds);
                                  
    if(index == -1){ 
      message.channel.send('`'+ target + '`' + ' is not in the database !'); 
    } else {
      let pType = pathVar+'/type', pLink = pathVar+'/link', 
          link = dtaInter.data.getData(pLink),
          type = dtaInter.data.getData(pType);
      type.splice(index-error,1);
      dtaInter.up([cmds[index],link[index-error],type],[pathCmds,pLink,pType],['remove','remove','set']);
    }
  },
  sendMeme: function(message,index,obj){
    let type = dtaInter.data.getData(pathVar+'/type'); let url = dtaInter.data.getData(pathVar+'/link')[index]; 
    type[index] == 'g' ? util.data.sendImageLink(url,message,undefined,true) : (type[index] == 'y' ? audio.data.play(message.member.voiceChannel,url,true) : audio.data.play(message.member.voiceChannel,url,false));
  },
  main : function(message,command,args,client){
    let dta;
    
    switch(command){
      case 'new':
        //dta = dtaInter.read();
        dtaInter.up([true],[pathVar+'/bool'],['set']);
        collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, {time: 60000});
        methods.new(message,args,client);
        break;
      case 'listofmemes': 
        //dta = dtaInter.read();
        let list = dtaInter.data.getData(pathCmds), i = dtaInter.data.getData(pathVar+'/newIndex'), string = 'here are the memes: \n';
        list = list.slice(i);
        for(var j of list){
          string += ' - **' + j +'**\n';
        }
        message.reply(string + 'To add a new meme use command  `$$new <meme_name>`');
        break;
      case 'remove':
        methods.removeMeme(message,args);   
        break;
      default: 
        //dta = dtaInter.read();
        let cmds = dtaInter.data.getData(pathCmds), error = dtaInter.data.getData(pathVar+'/newIndex'), ind = util.data.arrayFind(command,cmds);  
        ind != -1 ? methods.sendMeme(message,ind-error,dta) : message.reply('not found in the database, to add a new meme use ` $$new <meme_name> `.');
    }
  }
};

exports.data = methods;