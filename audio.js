const ytdl = require('ytdl-core');
const streamOptions = { seek: 0, volume: 1 };

var methods = {
  playAudio: function (channel, audioFile){
    channel.join()
    .then(connection => {
      const stream = ytdl(audioFile, { filter : 'audioonly' });
      const dispatcher = connection.playStream(stream,streamOptions);
      dispatcher.on("end", end => { 
        channel.leave();}); 
    }).catch(err => console.log(err)); 
  }
}

exports.data = methods; 