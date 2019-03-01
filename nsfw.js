// TODO: --> SendNSFW: Refill null arrays
var util = require('./utility.js');
const randomPuppy = require('random-puppy');

var variables = {
  arrayNSFW : [],
  arrayNSFWauto : [],
  arrayNSFWhentai : [],
  arrayNSFWboobs : [],
  arrayNSFWass : [],
  arrayNSFWhot : [],
  dataSUBR: [['nsfw','boobs','ass'],['boobs'],['ass'],['HQHentai','Hentai','HuggingHentai'],['instahotties','Page3Glamour']],
  nbrSUBR : 5,
  boolNSFW : false,
  timeNSFW : 480,
  count : 0,
  escape : 0,
}
var methods = {
  post:async function (array,index,message){
    while (variables.boolNSFW){
      methods.sendNSFW(array,index,message);
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
    for (var i of subr){
      variables.count = 0; variables.escape = 0;
      while (variables.count < 100 && variables.escape < 100){ 
        await methods.puppy(i,index); 
      }
    }
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
  init: async function(){
    console.log(" -------------------------");
    console.log(" Initializing NSFW arrays:");
    for (var i = 0; i<variables.nbrSUBR; i++){
      await methods.puppyFill(variables.dataSUBR[i],i);
      console.log(" - Filled array index " + i + " with " + methods.map(i).length + " urls");
    }
    variables.arrayNSFWauto = variables.arrayNSFW.concat(variables.arrayNSFWass, variables.arrayNSFWboobs, variables.arrayNSFWhentai, variables.arrayNSFWhot);
    console.log(" - Concatenated array auto with " + variables.arrayNSFWauto.length + " urls");
  },
  sendNSFW: async function(array,index,message){
    console.log(" -------------------------");
    console.log(" Sending pic to channel: " + message.channel.name);
    if (typeof array == 'undefined' || array.length == 0){
      await methods.puppyFill(array,index);
    }
    var i = Math.floor(Math.random()*array.length); console.log(" - Removing and posting image index " + i +": " + array[i]);
    var image = array.splice(i,1).toString();
    util.data.sendImageLink(image,message);
    console.log(" - Done");
  },
  main: function(message, client, config){
    if (methods.isNSFW(message)){
      const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
      const command = args.shift().toLowerCase();
      console.log(" - User: " + message.author.username); console.log(" - Channel: " + message.channel.name); console.log(" - Message: " + message.content);
      
      switch(command){
        case 'ass':
          methods.sendNSFW(variables.arrayNSFWass,2,message); 
          break;
        case 'boobs':
          methods.sendNSFW(variables.arrayNSFWboobs,1,message);
          break;
        case 'hentai':
          methods.sendNSFW(variables.arrayNSFWhentai,3,message);
          break;
        case 'hot':
          methods.sendNSFW(variables.arrayNSFWhot,4,message);
          break;
        case 'auto':
          if (args.length === 1){
            variables.timeNSFW = args[0]; 
          }
          variables.boolNSFW = true;
          methods.post(variables.arrayNSFWauto,-1,message);  
          break;
        case 'off':
          variables.boolNSFW = false;
          variables.timeNSFW = 480;
          break;
        default:
      }
    } else {
      message.channel.send('Only available in NSFW channels !');
    }
  }
}

var cmd = [];
exports.cmd = cmd;
exports.data = methods;
exports.var = variables;

