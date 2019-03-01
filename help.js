// help cmd
var cmd = require('./commands.js');
var NSFW = require('./nsfw.js');

var gen = [["ping","In case you wanna know if you can play, hein Dorian !"],["say",""],["purge <amount>","Delete up to 100 messages from the current TextChannel"],["github","Link of the Github's files"],["help","AAAAAAH I'm lost !"]];
var nsfw = NSFW.cmd;

function main (message) {
  var output = "```Commands: \n";
  for (var i of gen){
    output += "\n"+ i[0]+" : "+i[1]+"\n";
  }
  output += "\nNSFW Commands: \n";
  //for (var i of nsfw){
    //output += i[0] + " : " + i[1] + "\n";
  //}
  console.log(output);
  message.channel.send(output+"```");
}

exports.main = main;