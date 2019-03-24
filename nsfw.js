var util = require('./utility.js');
const dtaInter = require('./dataInterface.js');
const randomPuppy = require('random-puppy');
const meme = require('./meme.js');

var Cmds = ['auto','autoff','hot','ass','boobs','hentai']; 
var Desc = ['Turn on automatic posting of NSFW photos every `<time_step>` mins (default 4hrs).','Turn off automatic posting in the current NSFW channel.','Ask PinkGuy for a hot pic.','Ask an ass pic.','Ask some boobs pic.','Get that anime lewd stuff ... :cmonBruh:'];
var Usage = ['<time_step>','','','','',''];

var nsfwPath = ['Var','nsfw'];

var variables = {
  arrayNSFW : [],
  arrayNSFWauto : [],
  arrayNSFWhentai : [],
  arrayNSFWboobs : [],
  arrayNSFWass : [],
  arrayNSFWhot : [],
  dataSUBR: [],
  nbrSUBR : [],
  boolNSFW : [],
  timeNSFW : [], 
  count : [],
  escape : [],
}
var methods = {
  post:async function (array,index,message,client,bool){
    if (bool) { 
      let dta = dtaInter.data.read();
      dtaInter.data.update(message.channel.id,nsfwPath.concat('channel'),dta,'set',function(){ return true; });
    }
    console.log(" -------------------------");
    bool ? console.log(" Starting auto post in channel: " + message.channel.name) : console.log(" - Starting auto post in channel: " + client.channels.get(message).name);
    while (variables.boolNSFW){
      methods.sendNSFW(array,index,message,client,bool);
      await util.data.sleep(variables.timeNSFW*60000);
    }
  },
  isNSFW: function (message){
    return message.channel.nsfw;
  },
  puppy: async function(subr,index){
    await randomPuppy(subr)
    .then(url => {
        if (typeof url == 'string'){
          methods.map(index).push(url);
          variables.count++;
        } else { variables.escape++;}
    }) 
  },
  puppyFill: async function(subr,index){
    if(variable => variable !== null && Symbol.iterator in subr(variable)){//check iterable !!!
      for (var i of subr){
        variables.count = 0; variables.escape = 0;
        while (variables.count < 100 && variables.escape < 100){ 
          await methods.puppy(i,index); 
        }
    }}
  },
  map: function (index){
    switch(index){
      case 0:
        return variables.arrayNSFW;
        break;
      case 1:
        return variables.arrayNSFWboobs;
        break;
      case 2:
        return variables.arrayNSFWass;
        break;
      case 3:
        return variables.arrayNSFWhentai;
        break;
      case 4:
        return variables.arrayNSFWhot;
        break;
      default: return variables.arrayNSFWauto;
    }
  },
  init: async function(client){
    let dta = dtaInter.data.read();
    let path = ['nsfw','boobs','ass','hentai','hot'];
    
    console.log(" -------------------------");
    console.log(" Initializing NSFW control var:");
    
    variables.dataSUBR = dtaInter.data.getItem(nsfwPath.concat('subr'),dta);
    variables.nbrSUBR = variables.dataSUBR.length;
    variables.timeNSFW = dtaInter.data.getItem(nsfwPath.concat('time_step'),dta);
    variables.boolNSFW = dtaInter.data.getItem(nsfwPath.concat('bool'),dta); 
    
    console.log(" - SubrNsfw : \n ", variables.dataSUBR);  
    console.log(" - SubrLength : " + variables.nbrSUBR);
    console.log  (" - TimeNsfw : " + variables.timeNSFW); 
    console.log(" - BoolNsfw : " + variables.boolNSFW); 
    
    console.log(" -------------------------");
    console.log(" Initializing NSFW arrays:");
    
    variables.arrayNSFW = dtaInter.data.getItem(nsfwPath.concat('nsfw'),dta);
    variables.arrayNSFWhentai = dtaInter.data.getItem(nsfwPath.concat('hentai'),dta);
    variables.arrayNSFWboobs = dtaInter.data.getItem(nsfwPath.concat('boobs'),dta);
    variables.arrayNSFWass = dtaInter.data.getItem(nsfwPath.concat('ass'),dta);
    variables.arrayNSFWhot = dtaInter.data.getItem(nsfwPath.concat('hot'),dta);
    
    for (var i = 0; i<variables.nbrSUBR; i++){
      if (methods.map(i).length == 0){
        await methods.puppyFill(variables.dataSUBR[i],i); 
        dtaInter.data.update(methods.map(i),nsfwPath.concat(path[i]),dta,'set',function(){return typeof(methods.map(i)) === typeof([]);});
        console.log(" - Filled array " + i + " with " + methods.map(i).length + " urls");
      } else { console.log(" - Imported array " + i + " with " + methods.map(i).length + " urls"); }
    }
    variables.arrayNSFWauto = variables.arrayNSFW.concat(variables.arrayNSFWass, variables.arrayNSFWboobs, variables.arrayNSFWhentai, variables.arrayNSFWhot);
    console.log(" - Concatenated array auto with " + variables.arrayNSFWauto.length + " urls");
    
    if(variables.boolNSFW) methods.post(variables.arrayNSFWauto,-1,dtaInter.data.getItem(nsfwPath.concat('channel'),dta),client,false);
  }, 
  sendNSFW: async function(array,index,message,client,bool){
    let path = ['nsfw','boobs','ass','hentai','hot'];
    console.log(" -------------------------");
    bool ? console.log(" Sending pic to channel: " + message.channel.name) : console.log(" Sending pic to channel: " + client.channels.get(message).name);
    if (typeof array == 'undefined' || array.length == 0){
      await methods.puppyFill(array,index);
    }
    var i = Math.floor(Math.random()*array.length); console.log(" - Removing and posting image index " + i +": " + array[i]);
    var image = array.splice(i,1).toString();
    if(index != -1) dtaInter.data.update(array,nsfwPath.concat(path[index]),dtaInter.data.read(),'set',function(){return true;}); 
    util.data.sendImageLink(image,message,client,bool);
    console.log(" - Done");
  },
  main: function(message, command, args, client){
      let dta = dtaInter.data.read();
      switch(command){
        case 'ass':
          if (methods.isNSFW(message)){
            methods.sendNSFW(variables.arrayNSFWass,2,message,client,true);
          }else {
            message.reply('Only available in NSFW channels !');
          }
          break;
        case 'boobs':
          if (methods.isNSFW(message)){
            methods.sendNSFW(variables.arrayNSFWboobs,1,message,client,true);
          }else {
            message.reply('Only available in NSFW channels !');
          }
          break;
        case 'hentai':
          if (methods.isNSFW(message)){
            methods.sendNSFW(variables.arrayNSFWhentai,3,message,client,true);
          }else {
            message.reply('Only available in NSFW channels !');
          }
          break;
        case 'hot':
          if (methods.isNSFW(message)){
            methods.sendNSFW(variables.arrayNSFWhot,4,message,client,true);
          }else {
            message.reply('Only available in NSFW channels !');
          }
          break;
        case 'auto':
          if (methods.isNSFW(message)){
            if (args.length === 1){
              variables.timeNSFW = args[0];
              dtaInter.data.update(variables.timeNSFW,nsfwPath.concat('time_step'),dta,'set',function(){return true});
            }
            variables.boolNSFW = true;
            dtaInter.data.update(variables.boolNSFW,nsfwPath.concat('bool'),dta,'set',function(){return true});
            methods.post(variables.arrayNSFWauto,-1,message,client,true); 
          }else {
            message.reply('Only available in NSFW channels !'); 
          } 
          break;
        case 'autoff':
          if (methods.isNSFW(message)){
            variables.boolNSFW = false;
            variables.timeNSFW = 240;
            dtaInter.data.update(variables.boolNSFW,nsfwPath.concat('bool'),dta,'set',function(){return true});
            dtaInter.data.update(variables.timeNSFW,nsfwPath.concat('time_step'),dta,'set',function(){return true});
          }else {
            message.reply('Only available in NSFW channels !');
          }
          break;
        default:
          meme.data.main(message,command,args,client);
      }
  }
}

exports.data = methods;
exports.var = variables;
exports.cmd = Cmds;
exports.desc = Desc;
exports.use = Usage;
