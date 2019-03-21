const fs = require('fs');
const util = require('./utility.js');
const file = './data.json';

var oof = function (item,path,action,obj,acc){
  let key = path[0];
  if(path.length == 1){
    switch (action){
      case 'set':
        obj[key] = item;
        break;
      case 'add':
        let temp = obj[key];
        obj[key] = (typeof(temp) === typeof([]) ? util.data.push(temp,item) : new Array(item));  
        break;
      case 'remove':
        let temp2 = obj[key];
        typeof(temp2) === typeof([]) ? (typeof(temp2.indexOf(item)) === typeof(1) ? temp2.splice(temp2.indexOf(item),1) : temp2) : temp2;
        obj[key] = temp2;
        break;
    }
    return acc;
  }else{
    return oof(item,path.slice(1),action,obj[key],acc);
  }
};

var methods = {
  read: function(){
    return JSON.parse(fs.readFileSync(file,'utf8')); 
  },
  write: function(dta){
    fs.writeFileSync(file,JSON.stringify(dta),'utf8');
  },
  getItem: function(path,dta){
    var temp = dta;
    for (var i in path){
      temp = temp[path[i]];
    }
    return temp;
  },
  update: function(item, path, obj, action, control){
    if (control()) {
      oof(item,path,action,obj,obj);
      methods.write(obj);
    }
  }
}

exports.data = methods;