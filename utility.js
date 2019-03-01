var methods = {
  getRandomInt:function (max) {
    return Math.floor(Math.random() * Math.floor(max));
  },
  sleep:function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  isEmpty:function (array){
    var bool = true; 
    for (var i of array){
      bool = i == null;
    }
    return bool;
  },
  listVoiceChannels: function (channels,keys) {
    for (var i in keys) {
      const channel = channels.find(x => x.id === keys[i]);
      if (channel.type === 'voice'){
        console.log(" - name: " + channel.name + "  id: " + channel.id)
      }
    }
  },
  sendImageLink: function(url, message){
    message.channel.send({
      file: url
    });
  },
  changeActivity: async function(client){
    var bool = false;
    var time = methods.getRandomInt(180);
    var array = [['STREAMING','Barbie in the magical world'],['WATCHING','pornhub.com'],['WATCHING','Big Anime Tities'],['LISTENING','gay porn'],['LISTENING','to AYAYA for 10hrs'],['PLAYING','fOrTniTE']];
    while(true){
      var status = array[Math.floor(Math.random()*array.length)];
      if (bool) {
        console.log(" -------------------------");
        console.log(" Changing Status:");
      }
      console.log(" - New Status: " + status[0] + " " + status[1]);
      client.user.setActivity(status[1], { type: status[0] });
      console.log(" - Done, next status in " + time + " min");  
      await methods.sleep(time*60000);
      var time = methods.getRandomInt(180);
      bool = true;
    }
  }
}

exports.data = methods;