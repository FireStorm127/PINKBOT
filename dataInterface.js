//ready 4 1.0

const fs = require('fs'),
      util = require('./utility.js'),
      file = './data.json',
      JsonDB = require('node-json-db');

var dta = new JsonDB("./data.json",true,true,'/');

var Action = {
	set : function(item,path){
		dta.push(path,item);
	},
	addObj : function(item,path){
		let k = Object.keys(item), v = Object.values(item), n = k.length;
		for(var i = 0; i < n; i++){
			dta.push(path + '/' + k[i],v[i]);
		}
	},
	add : function(item,path){
		let temp = dta.getData(path);
		temp === null ? temp = item : (Array.isArray(temp) ? temp.push(item) : temp = new Array(temp,item));
		dta.push(path,temp);
	},
	remove : function(item,path){
		let temp;
		if(item === null){
			let newPath = path.split('/'), key = newPath.pop(); path = '';
			for(var i = 1; i < newPath.length; i++){
				path += '/' + newPath[i];
			}
			temp = dta.getData(path); delete temp[key];
		} else {
			temp = dta.getData(path); let index = util.data.arrayFind(item,temp);
			index !== -1 ? temp.splice(index,1) : console.log('Not found ['+ item + '] @' + path);
		} 
		dta.push(path,temp);
	}
}

function Update(items,paths,actions){
	if(items.length !== paths.length || items.length !== actions.length) return;
	for (var i = 0; i < paths.length; i++){
		if(actions[i] === 'set'){
			Action.set(items[i],paths[i]);
		} else if(actions[i] === 'add') {
			let temp = dta.getData(paths[i]);
			if(temp !== null && !Array.isArray(temp) && typeof(temp) === 'object'){
				Action.addObj(items[i],paths[i]);
			} else {
				Action.add(items[i],paths[i]);
			}
		} else {
			Action.remove(items[i],paths[i]);	
		}
	}
}

function Type(obj){
  let temp;
  typeof(obj) !== 'object' ? temp = typeof(obj) : (Array.isArray(obj) ? temp = 'array' : temp = 'object');
  return temp;
}

function read(f){
  !f ? f = file : f; 
  return JSON.parse(fs.readFileSync(f,'utf8')); 
}

function write(obj,f){
  !f ? f = file : f; 
  fs.writeFileSync(f,JSON.stringify(obj,null,'\t'),'utf8');
}

exports.read = read;
exports.write = write; 
exports.up = Update;
exports.data = dta;