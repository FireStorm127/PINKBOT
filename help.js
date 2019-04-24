
const util = require('./utility.js'),
      dtaInter = require('./dataInterface.js'),
      version = "0.9";
      
var today = new Date();

const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

var methods = {
  mapCmd: function(cmd,obj){
    let array = ['commands','audio','meme','nsfw'];
    for(let i of array){
      let j = util.data.arrayFind(cmd,obj.Cmds[i]);
      if(j != -1) return [j,i]
    }
    return -1
  },
  cmdDesc: function(cmd,obj){
    let list = "", List;
    switch(cmd.toLowerCase()){
      case 'audio':
        List = obj.Cmds.audio;
        for(var i of List){
          list = list + "\n"+ capitalize(i);
        }
        return {embed: module(cmd,"This module will help you manage PINK GUY when he is playing an audio file in a Voice Channel. In order to use these commands you need to be in a Voice Channel !\nComand in brackets are still in development :pensive:",list)}
        break;
      case 'meme':
        List = obj.Cmds.meme.slice(0,3);
        for(var i of List){
          list = list + "\n"+ capitalize(i);
        }
        return {embed: module(cmd+" :ok_hand:","ey Boss ! Are you a true Meme Lord?\nThis module allows any user of the guild to add his favourites memes (either audio or graphic). Take a look at the command **`new`** to get started !",list)}
        break;
      case 'nsfw':
        List = obj.Cmds.nsfw;
        for(var i of List){
          list = list + "\n"+ capitalize(i);
        }
        return {embed: module(cmd+" :eggplant: :omgItsSoFckingBig: :eggplant:","CaN i HaVe SOmE pUSsY plz ?\nThis module can __ONLY__ be used __IN NSFW CHANNELS__ ! It allows user to ask for some nsfw pic and gif.",list)}
        break;
      default:
        let index = methods.mapCmd(cmd,obj);
        if(index == -1) return -1;
        
        embedCMD.title = capitalize(obj.Cmds[index[1]][index[0]])
        embedCMD.description = obj.Desc[index[1]][index[0]]
        
        let use = obj.Usage[index[1]][index[0]];
        let fields = embedCMD.fields;
        fields[2].value = "```md\n$$ " + obj.Cmds[index[1]][index[0]] + " " + use + '```'
        if(use === ""){
          fields = fields.slice(0,3);
        } else {
          let arr = use.split(" "); fields = fields.slice(0,3+arr.length)
          for(var j = 0; j<arr.length; j++){
            fields[3+j].name = arr[j];
          }
        }
        let restr = obj.Restr[index[1]][index[0]]
        fields[0].value = restr[0]
        fields[1].value = restr[1]
        
        embedCMD.fields = fields;
        
        return {embed: embedCMD}
    }
  }
};
    
function main (message, args) { 
  let output = [], dta = dtaInter.read(), reply;
  if(args.length == 0){ 
    output = {embed: embedHelp};
  } else {
    output = methods.cmdDesc(args[0],dta);
    if (output == -1){ 
      output = "Unknown command !\nType `$$help` for commands list"; 
      reply = true;  
    }
  }
  if(!reply) message.channel.send(output);
  else message.reply(output);
};

var pinkuJPG = 'https://i1.sndcdn.com/artworks-000162081203-ppxkn6-t500x500.jpg';

var embedHelp = {
  "title": "Help",
  "description": "Did you know? You can ask PINK GUY for more details on a specific command using `$$help <command>`",
  "color": 15153074,
  "timestamp": today.toISOString(),
  "footer": {
    "icon_url": pinkuJPG,
    "text": "PINKGUY v" + version
  },
  "fields": [
    {
      "name": "Basic commands",
      "value": "```ml\nGithub\nHelp\nPing\nPurge```Use prefix `$$` to call any of PINKGUY's commands."
    },
    {
      "name": "Categories",
      "value": "To get specific commands from a module of the list below use the command ```md\n$$ help <module>``` Modules List : **`audio`**  **`meme`**  **`nsfw`**"
    }
  ]
};

function module(name,desc,cmd){
  let embed = {
   "title": capitalize(name),
   "description":desc,
   "color":15153074,
   "timestamp": today.toISOString(),
    "footer": {
      "icon_url": pinkuJPG,
      "text": "PINKGUY v" + version
    },
    "fields": [
      {
        "name": "List of Commands",
        "value": "```ml"+cmd+"```"
      },
      {
        "name": "Need more details ?",
        "value": "Use command **`help <command_name>`** to get further informations on the usage of a command."
      }
    ]
   };
  return embed
}
var embedCMD = {
  "title": "Command",
  "description": "Desc",
  "color": 15153074,
  "timestamp": today.toISOString(),
  "footer": {
    "icon_url": pinkuJPG,
    "text": "PINKGUY v" + version
  },
  "fields": [
    {
      "name": "User Permissions",
      "value": "No restrictions",
      "inline": true
    },
    {
      "name": "Bot Permissions",
      "value": "No restrictions",
      "inline": true
    },
    {
      "name": "Usage",
      "value": "```$$ purge <amount>```"
    },
    {
      "name": "<amount>",
      "value": "these last two",
      "inline": true
    },
    {
      "name": "<others>",
      "value": "are inline fields",
      "inline": true
    }
  ]
};

exports.main = main;