//TODO: --> main: cmd github (create github !!!)
//      --> help section 
const util = require('./utility.js');
var help = require('./help.js');

var methods = {
  main: async function (message, client, config){
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    console.log(" - User: " + message.author); console.log(" - Channel: " + message.channel.name); console.log(" - Message: " + message.content);
    
    switch(command) {
      case 'ping':
        const m = await message.channel.send("Ping?");
        m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
        break;
      case 'say':
        // makes the bot say something and delete the message. As an example, it's open to anyone to use. 
        // To get the "message" itself we join the `args` back into a string with spaces: 
        const sayMessage = args.join(" ");
        // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
        message.delete().catch(O_o=>{}); 
        // And we get the bot to say the thing: 
        message.channel.send(sayMessage);
        break;
      case'purge':
        // This command removes all messages from all users in the channel, up to 100.
    
        // get the delete count, as an actual number.
        const deleteCount = parseInt(args[0], 10);
    
        // Ooooh nice, combined conditions. <3
        if(!deleteCount || deleteCount < 2 || deleteCount > 100)
        return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
    
        // So we get our messages, and delete them. Simple enough, right?
        const fetched = await message.channel.fetchMessages({limit: deleteCount});
        message.channel.bulkDelete(fetched)
          .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
        break;
      case 'github':
        
        break;
      case 'help':
        help.main(message);
        break;
      default:
		    message.reply('Not a command \nType !! help for command list'); 
    }
  }
}

exports.data = methods;