const data = require('./dataInterface.js');

var methods = {
  getRandomInt:function (max) {
    return Math.floor(Math.random() * Math.floor(max));
  },
  sleep:function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  isEmpty:function (array){
    let bool = true; 
    for (var i of array){
      bool = i == null;
    }
    return bool;
  },
  push: function (array,item){
    array[array.length] = item
    return array;
  },
  arrayFind: function(element,array){
    for (var i = 0; i<array.length; i++){
      if (array[i] === element) return i;
    }
    return -1;
  },
  listVoiceChannels: function (channels,keys) {
    for (var i in keys) {
      const channel = channels.find(x => x.id === keys[i]);
      if (channel.type === 'voice'){
        console.log(" - name: " + channel.name + "  id: " + channel.id)
      }
    }
  },
  sendImageLink: function(url, message, client, bool){
    bool ? message.channel.send({file: url}) : client.channels.get(message).send({file: url});
  },
  changeActivity: async function(client){
    var bool = false;
    var time = methods.getRandomInt(180);
    var array = data.data.getItem(['Var','utility','activity'],data.data.read());//[['WATCHING','https://www.pornhub.com'],['WATCHING','Big Anime Tities'],['WATCHING','https://www.youtube.com/watch?v=D0q0QeQbw9U'],['PLAYING','fOrTniTE'],['LISTENING','Oof compilations'],['WATCHING','iCarly']];
    while(true){
      var status = array[methods.getRandomInt(array.length-1)];  
      if (bool) {
        console.log(" -------------------------");
        console.log(" Changing Status:");
      }
      console.log(" - New Status: " + status[0] + " " + status[1]);
      client.user.setActivity(status[1], { type: status[0] });
      console.log(" - Done, next status in " + time + " min");  
      await methods.sleep(time*60000);
      time = methods.getRandomInt(180);
      bool = true;
    }
  }
}

exports.data = methods;