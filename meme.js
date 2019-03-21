const audio = require('./audio.js');
const dtaInter = require('./dataInterface.js');
const util = require('./utility.js');
const config = require("./config.json");

var pathCmds = ['Cmds','meme']; 
var pathVar = ['Var','meme'];

var methods = {
  awaitBool: async function(time){
    await util.data.sleep(time*60000);
    dtaInter.data.update(false,pathVar.concat('bool'),dtaInter.data.read(),'set',function(){return true;}); 
  },
  identifyType(message,bool){
    let identifiers = ['g','a','y']; // g> graphic  a> audio  y> youtube video
    if(bool == undefined){
      
    } else {
      
    }
  },
  new: function(msg,args,client){
    let cmd = args[0]; let link; let type;
    msg.reply('Send file or link of the meme.')
    methods.awaitBool(5); 

    client.on("message", message => {
      if(dtaInter.data.getItem(pathVar.concat('bool'),dtaInter.data.read())){
      if(message.author.bot) return; // check if not bot
      if(msg.content == message.content || msg.author != message.author){ // ignores others  users and cmd message <new>
        return;
      } else {
        dtaInter.data.update(false,pathVar.concat('bool'),dtaInter.data.read(),'set',function(){return true;});
        message.attachments.first() != undefined ? type = methods.identifyType(message.attachments.first(),true) : type = methods.identifyType(message);  
        //link = type[0];
        console.log(message.attachments.first())
      }}
    }); 
  },
  sendMeme: function(message,index,obj){
    let type = dtaInter.data.getItem(pathVar.concat('type'),obj);
    //type[index][0] == 'g' ? methods.gMeme(message,index,type,obj) : methods.aMeme(message,index,type,obj);  
  },
  main : function(message,command,args,client){
    let dta = dtaInter.data.read();
    
    switch(command){
      case 'new':
        dtaInter.data.update(true,pathVar.concat('bool'),dta,'set',function(){return true;});
        methods.new(message,args,client);
        break;
      case 'listOfMemes':
        
        break;
      default:
        let cmds = dtaInter.data.getItem(pathCmds,dta);
        cmds.indexOf(command) == typeof(1) ? methods.sendMeme(message,cmds.indexOf(command)) : message.reply('U R GAY');
    }
  }
};

exports.data = methods;