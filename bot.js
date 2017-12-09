var token = "meme";
const Discord = require("discord.js");
const client = new Discord.Client();
var call = "!";
const fs = require("fs");

var countries = {};
var map = {};

var width = 100;
var height = 100;

var tickSpeed = 300000;

class cell{
	constructor(x,y){
		this.x = x;
		this.y = y;
		this.resource = Math.round(Math.random()*10);
		this.elevation = 0;
		this.climate = 0;
		this.owner = "none";
	}
}


class war{
	constructor(a,d,x,y){
		this.attacker = a;
		this.defender = d;
		this.aForce = 0;
		this.dForce = 0;
		this.cell = map[x][y];
		this.x = x;
		this.y = y;
	}
}

class location{
	constructor(x,y){
		this.x = x;
		this.y = y;
	}

}

try{
	console.log("[LOADING DATA]");
	countries = require("./data.json");
	map = require("./map.json");
}catch(err){
	console.log("[FAILED TO LOAD!!! CREATING DATA]");
	countries = {};
	map = {};
	for(var x = 0; x < width; x++){
		map[x] = {};
		for(var y = 0; y < height; y++){
			map[x][y] = new cell(x,y);
		}
	} 
	save();
}

function formatMass(val){
	
	if(Math.floor(val/1000)>1000){
		var ton = Math.floor(val/(1000*1000));
		var kg = Math.floor((val-ton)/1000);
		var gram = Math.round((val-ton-kg)*10)/10;
		var s = "";
		if(ton>1){
			s = "s";
		}
		return ton+" metric crap ton"+s+" "+kg+"kg "+gram+"g";
	}else if(val>1000){
		return Math.floor(val/1000)+"kg "+val%1000+"g";
	}
	return val+"g";
}

function save(){
	temp = JSON.stringify(countries);
	fs.writeFile('./data.json',temp,function(err) {
		if(err) return console.error(err);
	})
	temp = JSON.stringify(map);
	fs.writeFile('./map.json',temp,function(err) {
		if(err) return console.error(err);
	})
	
	fs.writeFile('./map.txt',getLocalMap(width/2,height/2,(width/2)+2,(height/2)+2,"sgkj;ljsfg"),function(err) {
		if(err) return console.error(err);
	})
}

function recursiveWait(p,time,total){
	p.time = total-time;
	if(time<total){
		setTimeout(function(){
			time++;
			recursiveWait(p,time,total);
		},1000);
	}else{
		people[p.id].canMine = true;
	}
}

class country{
	constructor(id,name){
		this.id = id;
		this.name = name;
		this.owner = "Generic Ruler #"+Math.round(Math.random()*5000);
		this.allies = [];
		this.economyType = "capitalist";
		this.governmentType = "dictatorship";
		this.resource = 0;
		this.allies[0] = id;
		this.population = {};
		this.ownedCells = 0;
		this.population.size = 1000;
		this.population.loyalty = 1;
		this.population.manpower = 0.2;
		this.capital = new location(Math.round(Math.random()*width),Math.round(Math.random()*height));
		var tries = 0;
		var owner = map[this.capital.x][this.capital.y].owner;
		if(owner != "none"){
			while(owner != "none" && tries < 200){
				this.capital = new location(Math.round(Math.random()*width),Math.round(Math.random()*height));
				try{
					owner = map[this.capital.x][this.capital.y].owner;
				}catch(err){
					
				}
				tries++;
			}
		}
		for(var x = this.capital.x-2; x < this.capital.x+3; x++){
			for(var y = this.capital.y-2; y < this.capital.y+3; y++){
				try{
					if(map[x][y].owner == "none"){
						map[x][y].owner = id;
					}
				}catch(err){
					
				}
			}
		}
		map[this.capital.x][this.capital.y].owner = id;
		save();

	}
	
	
}

function getOwnedCells(c){
	var temp = 0
	for(x in map){
		for(y in map[x]){
			if(countries[map[x][y].owner] != undefined){
				if(map[x][y].owner == c.id){
					temp++;
				}
			}
		}
	}
	return temp;
}

var wars = {};

function getLocalMap(sx,sy,width,height,c){
	temp = "";
	//console.log((sx-width)+","+(sx+width)+"|"+(sy-height)+","+(sy+height));
	try{
		for(var x = parseInt(sx)+parseInt(width); x > sx-width; x--){
			for(var y = sy-height; y < parseInt(sy)+parseInt(height); y++){
				try{
					if(x == sx && y == sy){
						temp+="+";
					}else{
						if(wars[x+"|"+y] != undefined){
							temp+="░";
						}else{
							
							if(countries[map[x][y].owner] != undefined){
								if(countries[map[x][y].owner].capital.x == x && countries[map[x][y].owner].capital.y == y){
									temp += "*";
								}else{
									try{
										var o = map[x][y].owner;
										if((map[x+1][y].owner != o || map[x-1][y].owner != o || map[x][y+1].owner != o || map[x][y-1].owner != o) && wars[x+"|"+y] == undefined){
											temp+="█";
										}else{
											temp += countries[map[x][y].owner].name.charAt(0);
										}
										
										
									}catch(err){
										temp += countries[map[x][y].owner].name.charAt(0);
										//console.log(err);
									}
								}
							}else{
								temp += ".";
								//map[x][y].owner = "none";
							}
						}
					}
				}catch(err){
					temp+="#";
				}
			}
			temp+="\n";
		}
		//console.log(temp);
		return temp;
	}catch(err){
		return "Error occured";
	}
}


function tick(repeat){
	var report = "";
	console.log("===================================");
	console.log("   Today is a new day")
	//client.channels.find("id","386688984845123587").send("A day has passed!");
	report+="========================\n";
	report+="Daily news!\n";
	report+="========================\n";
	warVictories = {};
	for(c in countries){
		countries[c].ownedCells = getOwnedCells(countries[c]);
	}
	for(x in map){
		for(y in map[x]){
			if(countries[map[x][y].owner] != undefined){
				countries[map[x][y].owner].resource += map[x][y].resource;
				if(countries[map[x][y].owner].population.size > countries[map[x][y].owner].ownedCells * 1000){
					countries[map[x][y].owner].population.size = countries[map[x][y].owner].ownedCells * 1000
				}
			}
		}
	}
	
	for(c in countries){
		if(countries[c].population.size < 1){
			report+=countries[c].name+" HAS FALLEN!!! <@"+c+">\n";
			//client.channels.find("id","386688984845123587").send(countries[c].name+" HAS FALLEN!!! <@"+c+">");
			//console.log(countries[c].name+" fell due to population concerns: "+countries[c].population.size);
			for(x in map){
				for(y in map[x]){
					if(map[x][y].owner == c){
						map[x][y].owner = "none";
					}
				}
			}
			delete countries[c];
			
			
		}else{
			countries[c].population.size += Math.round(countries[c].population.size*0.01); 
			if(countries[c].population.size > countries[c].ownedCells * 1000){
				countries[c].population.size = countries[c].ownedCells * 1000
			}
		}
	}
	var wcount = 0;
	for(w in wars)
		wcount++;
	console.log("===================================");
	console.log("there are "+wcount+" wars currently");
	for(w in wars){
		try{
			if(map[wars[w].x][wars[w].y].owner == "none"){
				if(Math.random() < 0.8){
					map[wars[w].x][wars[w].y].owner = wars[w].attacker;
				}
			}else{
					for(var x = parseInt(wars[w].x)-1;x<parseInt(wars[w].x)+2;x++){
						for(var y = parseInt(wars[w].y)-1;y < parseInt(wars[w].y)+2;y++){
							try{
								if(map[x][y].owner == wars[w].attacker){
									wars[w].aForce += ((countries[map[x][y].owner].population.size * countries[map[x][y].owner].population.manpower) / (countries[map[x][y].owner].ownedCells)*1.25)*(Math.random()*2);
								}
								if(wars[w].defender != "none"){
									if(map[x][y].owner == wars[w].defender){
										wars[w].dForce += ((countries[map[x][y].owner].population.size*countries[map[x][y].owner].population.manpower)/(countries[map[x][y].owner].ownedCells))*(Math.random()*2);
									}
								}
							}catch(err){
								
							}
						}
					}
					//client.channels.find("id","386688984845123587").send("War, "+wars[w].aForce+" force vs "+wars[w].dForce+" force");
				if(wars[w].aForce > wars[w].dForce && Math.random() < 0.8){
					//client.channels.find("id","386688984845123587").send("War won by "+countries[wars[w].attacker].name+", won with "+wars[w].aForce+" force");
					if(warVictories[wars[w].attacker] == undefined){
						warVictories[wars[w].attacker] = 1;
					}else{
						warVictories[wars[w].attacker] += 1;
					}
					map[wars[w].x][wars[w].y].owner = wars[w].attacker;
					if(wars[w].defender != "none"){
						countries[wars[w].attacker].population.size -= (((countries[wars[w].attacker].population.size * countries[wars[w].attacker].population.manpower) / (countries[wars[w].attacker].ownedCells)) * 1);
						countries[wars[w].defender].population.size -= (((countries[wars[w].defender].population.size * countries[wars[w].defender].population.manpower) / (countries[wars[w].defender].ownedCells)) * 0.5);
					}
					if(wars[w].defender != "none"){
						if(wars[w].x == countries[wars[w].defender].capital.x && wars[w].y == countries[wars[w].defender].capital.y){
							//client.channels.find("id","386688984845123587").send(countries[wars[w].defender].name+" HAS FALLEN!!! <@"+wars[w].defender+">");
							for(x in map){
								for(y in map[x]){
									if(map[x][y].owner == wars[w].defender){
										map[x][y].owner = "none";
									}
								}
							}
							report+=countries[c].name+" HAS FALLEN!!! <@"+c+">\n";
							delete countries[wars[w].defender];
							//console.log(countries[wars[w].defender].name+" fell due to loosing a war");
							
						}
					}
					var tempd = "none";
					if(wars[w].defender != "none")
						tempd = countries[wars[w].defender].name;
					console.log(countries[wars[w].attacker].name+":"+wars[w].aForce+" captured "+wars[w].x+","+wars[w].y+" from "+tempd+":"+wars[w].dForce);
				}else{
					//client.channels.find("id","386688984845123587").send("War lost by "+countries[wars[w].attacker].name+", lost to "+wars[w].dForce+" force");
					//console.log(countries[wars[w].defender].name+":"+wars[w].dForce+" defended "+wars[w].x+","+wars[w].y+" from "+countries[wars[w].attacker].name+":"+wars[w].aForce);
					if(countries[wars[w].defender]!=undefined){
						countries[wars[w].attacker].population.size -= (((countries[wars[w].attacker].population.size * countries[wars[w].attacker].population.manpower) / (countries[wars[w].attacker].ownedCells)) * 1);
						countries[wars[w].defender].population.size -= (((countries[wars[w].defender].population.size * countries[wars[w].defender].population.manpower) / (countries[wars[w].defender].ownedCells)) * 0.5);
					}
				}
			}
		}catch(err){
			
		}
		//countries[w.attacker].name);
		delete wars[w];
		
		
	}
	
	var tempCount = 0;
	for(v in warVictories){
		if(countries[v].name != undefined){
			tempCount++;
			try{
				report+=countries[v].name+" claimed "+warVictories[v]+" cells of land\n";
			}catch(err){
				
			}
		}
		
	}
	if(tempCount == 0)
		report+="The world is at peace!\n";
	report+="========================\n";
	report+="Census ( Average force per cell )\n";
	report+="========================\n";
	var forceList = [];
	for(c in countries){
		countries[c].ownedCells = getOwnedCells(countries[c]);
		var f = forceList.length;
		forceList[f] = {};
		forceList[f]["name"] = countries[c].name;
		forceList[f]["force"] = (countries[c].population.size * countries[c].population.manpower) / (countries[c].ownedCells)+"\n";
	}
	for(var j = 0; j<forceList.length; j++){
		for(var i = 0; i<forceList.length-1; i++){
			if(forceList[i].force > forceList[i+1].force){
				var temp = forceList[i+1];
				forceList[i+1] = forceList[i];
				forceList[i] = temp;
			}
		}
	}
	for(var f = 0; f<forceList.length; f++){
		report+=forceList[f].name+": "+(Math.round(forceList[f].force*100)/100)+"\n";
	}
	report+="========================\n";
	client.channels.find("id","386688984845123587").send(report);
	
	
	
	save();
	if(repeat){
		setTimeout(function(){
			tick(true);
		},tickSpeed);
	}
}

function declareWar(x,y,a,d,warAll){
	if(wars[x+"|"+y] == undefined){
		if(map[x][y].owner == "none"){
			if(wars[x+"|"+y] == undefined){
				wars[x+"|"+y] = new war(a,"none",x,y);
				return null;
			}
		}
		if(a != d && !(countries[a].allies.includes(d)) && (map[x][y].owner == d || warAll)){
			if(warAll){
				d = map[x][y].owner;
			}
			if(wars[x+"|"+y] == undefined){
				wars[x+"|"+y] = new war(a,d,x,y);
			}
		}
	}
}

client.on('message',msg =>{
	try{
		id = msg.author.id;
		c = countries[id];
		content = msg.content.toLowerCase().split(" ");
		if(c == undefined){
			if(content[0] == call+"makecountry"){
				//console.log(content[1]);
				if(content[1] == undefined && content[1].charCodeAt(0)<=255 && content[0].length>1 && content[1].charAt(0) != "X" && content[1].charAt(0) != "*" && content[1].charAt(0) != "#" && !content[1].includes("@")){
					msg.channel.send("You need to specify a name! `"+call+"makecountry [name]` and the first char has to be ascii");
					
				}else{
					countries[id] = new country(id,msg.content.split(" ")[1]);
					msg.channel.send("You've created the country of "+msg.content.split(" ")[1]);
					save();
				}
			}
			
		}else{
			
			if(content[0] == call+"list"){
				temp = "";
				for(k in countries){
					temp+=countries[k].name+"\n";
				}
				msg.channel.send(temp);
			}
			
			if(content[0] == call+"allies"){
				temp = "";
				for(k in countries[id].allies){
					try{
						temp+=""+countries[countries[id].allies[k]].name+"\n";
					}catch(err){
						console.log(k+" had an error, it's ID = "+countries[id].allies[k]);
					}
				}
				msg.channel.send(temp);
			}

			
			if(content[0] == call+"ally"){
				var foundAlly = false;
				for(k in countries){
					//console.log(countries[k].name);
					if(countries[k].name.toLowerCase() == content[1]){
						countries[id].allies[countries[id].allies.length] = countries[k].id;
						msg.channel.send("You now have allied "+content[1]);
						foundAlly = true;
					}
				}
				if(!foundAlly){
					msg.channel.send("They dont exist!");
				}
			}
			if(content[0] == call+"map"){
				var x = content[2];
				var y = content[1];
				if(x == null || y == null){
					x=c.capital.x;
					y=c.capital.y;
				}
				msg.channel.send("```markdown\n"+getLocalMap(x,y,10,10,c)+"```");
				msg.channel.send("Center of ("+y+","+x+")");
			}
			if(content[0] == call+"stats"){
				var temp = "";
				for(k in c){
					temp+=k+":"+c[k]+"\n";
				}
				for(k in c.population){
					temp+=k+":"+c.population[k]+"\n";
				}
				msg.channel.send(temp);
			}
			if(content[0] == call+"movecapital"){
				if(map[content[2]][content[1]].owner == id){
					countries[id].capital.x = content[2];
					countries[id].capital.y = content[1];
					msg.channel.send("Capital moved!");
				}else{
					msg.channel.send("You don't own that land!");
				}
					
			}
			
			if(content[0] == call+"rename"){
				if(content[1]!=undefined && content[1].charCodeAt(0)<=255 && content[0].length>1 && content[1].charAt(0) != "X" && content[1].charAt(0) != "*" && content[1].charAt(0) != "#" && !content[1].includes("@")){
					msg.channel.send("The country of "+countries[id].name+" is now "+msg.content.split(" ")[1]);
					countries[id].name = msg.content.split(" ")[1];
					save();
				}else{
					msg.channel.send("You need a real name....");
				}
			}
			
			if(content[0] == call+"manpower"){
				if(content[1] != undefined){
					if(content[1] <= 100){
						if(content[1] >= 0){
							countries[id].population.manpower = parseFloat(content[1]/100);
							msg.channel.send("Manpower set to "+content[1]+"%");
							save();
						}else{
							msg.channel.send("Manpower too low!");
						}
					}else{
						msg.channel.send("Manpower too high!");
					}
				}else{
					msg.channel.send("You need to give a valid percentage, `"+call+"manpower 25` will set manpower at 25% of your population");
					
				}
			}
			
			if(content[0] == call+"war"){
				if(content[1] != undefined){
					var target = "";
					for(k in countries){
						try{
							if(countries[k].name.toLowerCase() == content[1]){
								target = k;
								msg.channel.send("Now at war with "+content[1]);
								break;
							}
						}catch(err){
							
						}
					}
					if(target != ""){
						for(var x in map){
							for(var y in map[x]){
								var warable = false;
								if(map[x][y].owner == target){
									for(var i = parseInt(x) - 1;i < parseInt(x) + 2;i++){
										for(var j = parseInt(y) - 1;j < parseInt(y) + 2;j++){
											try{
												if(map[i][j].owner == id){
													warable = true;
													break;
												}
											}catch(err){
												
											}
										}
									}
								}
								
								if(warable){
									declareWar(x,y,id,target,false);
								}else{
									
								}
							}
						}
					}else{
						if(content[1] == "all"){
							for(var x in map){
								for(var y in map[x]){
									var warable = false;
									if(map[x][y].owner != id){
										for(var i = parseInt(x) - 1;i < parseInt(x) + 2;i++){
											for(var j = parseInt(y) - 1;j < parseInt(y) + 2;j++){
												try{
													if(map[i][j].owner == id){
														warable = true;
														break;
													}
												}catch(err){
													
												}
											}
										}
									}
									
									if(warable){
										declareWar(x,y,id,map[x][y].owner,false);
									}else{
										
									}
								}
							}
						}
						msg.channel.send("War declared on all non-allies!");
					}
				}else{
					msg.channel.send("You need to specify where to war, north, east, south, west. or a specific country!");
				}
			}
			/*
			if(content[0] == call+"randomwar"){
				var repeat = 1;
				if(content[1] != undefined){
					repeat = content[1];
				}
				if(repeat > 2000){
					repeat = 2000;
				}
				var x = c.capital.x;
				var y = c.capital.y;
				for(var i = 0; i < repeat; i++){
					x = c.capital.x;
					y = c.capital.y;
					var temp = Math.round(Math.random()*4);
					while(wars[x+"|"+y] == undefined){
						x = parseInt(c.capital.x);
						y = parseInt(c.capital.y);
						var tries = 0;
						while(map[x][y].owner == c.id && wars[x+"|"+y] == undefined && tries < 20000 && c.allies.includes(map[x][y].owner)){
							//console.log(getLocalMap(x,y,3,3,c));
							tries++;
							if(temp == 1 && x < width-1)
								x++;
							if(temp == 2 && x > 0)
								x--;
							if(temp == 3 && y < height-1)
								y++;
							if(temp == 4 && y > 0)
								y--;
							temp = Math.round(Math.random()*4);
						}
					}
					/*
					if(temp == 1 && x < width-1)
						x--;
					if(temp == 2 && x > 1)
						x++;

					if(temp == 3 && y < height-1)
						y--;
					if(temp == 4 && y > 1)
						y++;
						
					//console.log(id+" vs "+map[x][y].owner);
					if(!c.allies.includes(map[x][y].owner) && tries < 20000)
						wars[x+"|"+y] = new war(id,map[x][y].owner,x,y);
					//console.log(wars[x+"|"+y].attacker);
				}
				msg.channel.send(
"```markdown\n"+getLocalMap(x,y,5,5,c)+"```");
				msg.channel.send("War at ("+x+","+y+")");
			}
		*/	
		
			if(content[0] == call+"deletecountry"){
				for(var x in map){
					for(var y in map[x]){
						if(map[x][y].owner == id){
							map[x][y].owner = "none";
						}
					}
				}
				delete countries[id];
				msg.channel.send("Country disbanded!");
			}
			
			if(content[0] == call+"fullmap"){
				save();
				msg.author.send('The Whole Map!',  {files: ["./map.txt"]});
				//console.log(getLocalMap(width/2,height/2,(width/2)+2,(height/2)+2,"sgkj;ljsfg"));
			}
			
			
			if(content[0] == call+"unally"){
				var foundAlly = false;
				for(k in countries[id].allies){
					try{
						//console.log(countries[countries[id].allies[k]].name+"|"+content[1]+":"+countries[id].allies[k]);
						if(countries[countries[id].allies[k]].name.toLowerCase() == content[1]){
							countries[id].allies[countries[id].allies[k]] = countries[id].allies.splice(k,1);
							msg.channel.send("You now have unallied "+content[1]);
							foundAlly = true;
						}
					}catch(err){
						console.log(err);
					}
				}
				if(!foundAlly){
					msg.channel.send("They dont exist!");
				}
			}
		
		}
		
		if(msg.author.id == "246589957165023232" || msg.author.id == "338914218470539266"){
			if(content[0] == call+"tick"){
				tick(false);
				msg.channel.send("tick forced!!! do not do this unless bugfixing!!!");
			}
			
			if(content[0] == call+"destroy"){
				target = content[1];
				msg.channel.say(countries[target].name+" got frickin' nuked");
				for(var x in map){
					for(var y in map[x]){
						if(map[x][y].owner == target){
							map[x][y].owner = "none";
						}
					}
				}
				delete countries[target];
			}
			
			if(content[0] == call+"forcerename"){
				countries[content[1]].name = msg.content.split(" ")[2];
				msg.channel.send("you were renamed <@"+content[1]+">");
			}
			
			if(content[0] == call+"setstat"){
				target = content[1];
				value = content[2];
				things = {};
				msg.channel.send("setting");
				for(k in content){
					if(k!=0 && k!=1 && k!=2){
						things[k] = {};
						things[k]["prop"] = content[k];
						msg.channel.send(content[k]);
					}
				}
				msg.channel.send("to "+value);
				if(things[4] != undefined){
					countries[target][things[3].prop][things[4].prop] = parseFloat(countries[target][things[3].prop][things[4].prop]);
					countries[target][things[3].prop][things[4].prop] = parseFloat(value);
				}else{
					if(things[3] != undefined){
						countries[target][things[3].prop] = value;
					}
				}
			}
			
		}
	}catch(err){
		console.log(err);
		msg.channel.send("Ow! error!");
	}
});
client.login(token);
/*
setTimeout(function(){

},600000);
*/
setTimeout(function(){
tick(true);
},1000);
