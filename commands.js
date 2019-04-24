//ready 4 1.0

const help = require('./help.js'),
      audio = require('./audio.js'),
      nsfw = require('./nsfw.js');
 
var methods = {
  main: async function (message, client, config){
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    console.log(" - User: " + message.author.username); console.log(" - Channel: " + message.channel.name); console.log(" - Message: " + message.content);
    
    switch(command) {
      case 'ping':
        const m = await message.channel.send("Ping?");
        m.edit(`Pong! BOT Latency is ${m.createdTimestamp - message.createdTimestamp}ms. Your Latency is ${Math.round(client.ping)}ms`);
        break;
      case 'say':
        const sayMessage = args.join(" ");
        message.delete().catch(O_o=>{});  
        message.channel.send(sayMessage);
        break;
      case'purge':
        const deleteCount = parseInt(args[0], 10);
    
        if(!deleteCount || deleteCount < 2 || deleteCount > 100)
        return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
        
        const fetched = await message.channel.fetchMessages({limit: deleteCount});
        message.channel.bulkDelete(fetched)
          .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
        break;
      case 'github':
        message.channel.send("https://github.com/FireStorm127/PINKBOT");
        break;
      case 'help':
        help.main(message, args);
        break;
      case 'audio':
        audio.data.main(message.member.voiceChannel,'https://www.youtube.com/watch?v=9MJ-RuNYILo',true)
        break;
      case 'stop':
        audio.data.stop(message);
        break;
      default:
		    nsfw.data.main(message,command, args, client); 
    }
  }
}

exports.data = methods;