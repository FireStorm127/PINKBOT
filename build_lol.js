var afterLoad = require('after-load'), 
	Div;

function dataObj(url){
	let html = afterLoad(url), body = html.split("<body>")[1].split("</body>")[0];
   	let OBJ = JSON.parse(body.split("ssr-preloaded-state")[1].split("</script>")[0].split("window.__PRELOADED_STATE__ = ")[1]);
   	//State = Object.assign({},OBJ);

   	let prop = ["hydrate","app","ad","homepage","tooltip"];
   	for (var p of prop){
   		if(OBJ.hasOwnProperty(p)){
   			delete OBJ[p];
   		}
   	}

   	Div = body.split('<div id="cookie-popup"></div>')[0]
   	return OBJ;
}

function fetchSummoners(){
	let summoners = Div.split('class="grid-block summoner-spells"')[1].split('class="grid-block toughest-matchups')[0]
	return sort(summoners.split('<div class='),'"image-wrapper');
}
function fetchItems(){
	let item = Div.split('class="grid-block starting-items"')[1].split('class="grid-block final-items"'),
		start = item[0],
		core = item[1].split('class="grid-block item-options-1"')[0];

	return [sort(),
			sort()];

}
function fetchSkillPath(champ){
	return champ["rec_skill_path"].items;
}
function fetchRunes(){
	let runes1 = Div.split('class="rune-tree"'),
		runes2 = runes1[2].split('class="stat-shards-container');
	
	return [sort(runes1[1].split('<div class='),'"perk perk-active'),
			sort(runes2[0].split('<div class='),'"perk perk-active'),
			sort(runes2[1].split('<div class='),'"shard shard-active')];
}

function sort(array,key){
	let out = new Array();
	array.forEach(function(element){
		if(element.includes(key)){
			out.push(element.split('<img src="')[1].split('" alt="')[0])
		}
	});
	return out;
}

function main(name,position){
	let url = 'https://u.gg/lol/champions/'+name.toLowerCase()+'/build',
		champion = {
			"summoner" : new Array(),
			"runes" : {
				"primary" : new Array(),
				"secondary" : new Array(),
				"stat" : new Array()
			},
			"items" : {
				"core" : new Array(),
				"start" : new Array()
			},
			"skillPath" : new Array()
		},
		champObj = dataObj(url).championProfile.championOverview[1]["world_platinum_plus_"+position],
		array = new Array();

	champion.summoner = fetchSummoners();

	let temp = fetchRunes();
	champion.runes.primary = temp[0];
	champion.runes.secondary = temp[1];
	champion.runes.stat = temp[2];

	//items

	champion.skillPath = fetchSkillPath(champObj)

	return champion;
}

console.log(main("nasus","top"));

var item = Div.split('class="grid-block starting-items"')[1].split('class="grid-block final-items"'),
	start = item[0],
	core = item[1].split('class="grid-block item-options-1"')[0];

var style = core.split('<div style=')
var tempK = new Array()
style.forEach(function(element){
	if(element.includes('background-image:url(')){
		tempK.push(element.split('background-image:url(')[1].split(';background-repeat')[0])
	}
});