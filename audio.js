const ytdl = require('ytdl-core');
const util = require('./utility.js');
const streamOptions = { seek: 0, volume: 1 };
require('isomorphic-fetch');
var stream;
var dispatcher;
const stack = [];
var chl = false;

var methods = {
  createStream : function(res,bool){
    let stream;
    if(bool == false){
      fetch(res)
      .then(function(response) {stream = response.body})
      .catch(err => console.log(err));
    } else {
      stream = ytdl(res, { filter : 'audioonly' });
    }
    return stream;
  },
  playAudio: function(channel, stream){
    channel.join()
    .then(connection => {
      const dispatcher = connection.playStream(stream,streamOptions);
      dispatcher.on("end", end => {
        channel.leave();});
    }).catch(err => console.log(err));
  },
  handler : function(){
    
  },
  stop: function(){
    chl = true;
  },
  play :async function(channel,res,bool){
    if(channel == undefined) return;
    channel.join()
    .then(connection => {
      fetch(res)
      .then(response => {
        bool ? stream = ytdl(res, { filter : 'audioonly' }) : stream = response.body
        const dispatcher = connection.playStream(stream,streamOptions);
        //if(Date.now()-start
        
        dispatcher.on("end", end => {
          channel.leave();});
      })}).catch(err => console.log(err));
  }
}

function main(){
  
}

exports.data = methods; 