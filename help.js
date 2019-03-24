var commands = require('./commands.js');
var nsfw = require('./nsfw.js');

function main (message, args) { 
  var output = []; 
  if(args.length == 0){ 
    output = cmdList();
  } else {
    output = cmdDesc(args);
    if (output == -1) output = "unknown command !\nType `$$help` for commands list";   
  }
  message.reply(output);
}

function cmdList() {
  var string = " hey bosss need some help?\n **General**\n"; 
  for (var i of commands.cmd){ 
   string += "   " + i + "\n";
  }
  
  string += " **Meme** :feelsgoodman:\n";
  //for (var i of cmdMeme[0]){
   //string += " " + i + "\n";
  //}
  
  string += " **Audio**\n"; 
  //for (var i of cmdAudio[0]){
   //string += " " + i + "\n";
  //}
  
  string += " **NSFW** :eggplant:\n";
  for (var i of nsfw.cmd){
   string += "   " + i + "\n";
  }
  string += "\nTo get further details on usage of a specific command, type:  ```$$help <command_name>``` ";
  return string;
}

function cmdDesc(args) {
  var string = "\n **Command**\n"; 
  if (commands.cmd.indexOf(''+args+'') != -1){
    var index = commands.cmd.indexOf(''+args+''); 
    string += " `" + commands.cmd[index] + "`\n **Description**\n " + commands.desc[index] + "\n **Usage**\n" + "```$$ " + commands.cmd[index] +" "+ commands.use[index] + "```";     
  }
  else if (nsfw.cmd.indexOf(''+args+'') != -1){
    var index = nsfw.cmd.indexOf(''+args+''); 
    string += " `" + nsfw.cmd[index] + "`\n **Description**\n " + nsfw.desc[index] + "\n **Usage** __NSFW channels__\n" + "```$$ " + nsfw.cmd[index] +" "+ nsfw.use[index] + "```"; 
  } else {return -1;}
  return string; 
}
 
exports.main = main;