//ready 4 1.0

const util = require('./utility.js'),
      dtaInter = require('./dataInterface.js'),
      randomPuppy = require('random-puppy'),
      meme = require('./meme.js');

var nsfwPath = '/Var/nsfw';

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
      //let dta = dtaInter.read();
      dtaInter.up([message.channel.id],[nsfwPath+'/channel'],['set']);
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
    //let dta = dtaInter.read();
    let path = ['nsfw','boobs','ass','hentai','hot'];
    
    console.log(" -------------------------");
    console.log(" Initializing NSFW control var:");
    
    variables.dataSUBR = dtaInter.data.getData(nsfwPath+'/subr');
    variables.nbrSUBR = variables.dataSUBR.length;
    variables.timeNSFW = dtaInter.data.getData(nsfwPath+'/time_step');
    variables.boolNSFW = dtaInter.data.getData(nsfwPath+'/bool'); 
    
    console.log(" - SubrNsfw : \n ", variables.dataSUBR);  
    console.log(" - SubrLength : " + variables.nbrSUBR);
    console.log  (" - TimeNsfw : " + variables.timeNSFW); 
    console.log(" - BoolNsfw : " + variables.boolNSFW); 
    
    console.log(" -------------------------");
    console.log(" Initializing NSFW arrays:");
    
    variables.arrayNSFW = dtaInter.data.getData(nsfwPath+'/nsfw');
    variables.arrayNSFWhentai = dtaInter.data.getData(nsfwPath+'/hentai');
    variables.arrayNSFWboobs = dtaInter.data.getData(nsfwPath+'/boobs');
    variables.arrayNSFWass = dtaInter.data.getData(nsfwPath+'/ass');
    variables.arrayNSFWhot = dtaInter.data.getData(nsfwPath+'/hot');
    
    for (var i = 0; i<variables.nbrSUBR; i++){
      if (methods.map(i).length == 0){
        await methods.puppyFill(variables.dataSUBR[i],i); 
        dtaInter.up([methods.map(i)],[nsfwPath+'/'+path[i]],['set']);
        console.log(" - Filled array " + i + " with " + methods.map(i).length + " urls");
      } else { console.log(" - Imported array " + i + " with " + methods.map(i).length + " urls"); }
    }
    variables.arrayNSFWauto = variables.arrayNSFW.concat(variables.arrayNSFWass, variables.arrayNSFWboobs, variables.arrayNSFWhentai, variables.arrayNSFWhot);
    console.log(" - Concatenated array auto with " + variables.arrayNSFWauto.length + " urls");
    
    if(variables.boolNSFW) methods.post(variables.arrayNSFWauto,-1,dtaInter.data.getData(nsfwPath+'/channel'),client,false);
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
    if(index != -1) dtaInter.up([array],[nsfwPath+'/index'],['set']); 
    util.data.sendImageLink(image,message,client,bool);
    console.log(" - Done");
  },
  main: function(message, command, args, client){
      //let dta = dtaInter.read();
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
              dtaInter.up([variables.timeNSFW],[nsfwPath+'/time_step'],['set']);
            }
            variables.boolNSFW = true;
            dtaInter.up([variables.boolNSFW],[nsfwPath+'/bool'],['set']);
            methods.post(variables.arrayNSFWauto,-1,message,client,true); 
          }else {
            message.reply('Only available in NSFW channels !'); 
          } 
          break;
        case 'autoff':
          if (methods.isNSFW(message)){
            variables.boolNSFW = false;
            variables.timeNSFW = 240;
            dtaInter.up([variables.boolNSFW,variables.timeNSFW],[nsfwPath+'/bool',nsfwPath+'/time_step'],['set','set']);
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
