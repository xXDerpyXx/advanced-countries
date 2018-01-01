/*jshint esversion: 6 */
// ##########################
//       Dependencies
// ##########################
const sqlite = require("sqlite");
const path = require("path");
const oneLine = require("common-tags").oneLine;
const Commando = require("discord.js-commando");
const Discord = require("discord.js");
const client = new Commando.Client({
	commandPrefix: "!"
});
const commitCount = require('git-commit-count');

//commitCount(); // number of process.cwd()
//commitCount('any/git/repo'); // number

const fs = require("fs");
client.setProvider(
	sqlite.open(path.join(__dirname, "settings.sqlite3")).then(db => new Commando.SQLiteProvider(db))
).catch(console.error);
client.registry
	.registerGroups([
		["war", "War commands"],
		["map", "Map commands"],
		["relations", "Manage your country relations"],
		["info", "Get info on you or others"],
		["options", "Change your country"]
	])
	.registerDefaults()
	.registerCommandsIn(path.join(__dirname, "cmds"));



var {
	oneline,
	formatMass,
	save,
	recursiveWait,
	getOwnedCells,
	loadGuns,
	saveImage,
	token,
	call,
	width,
	height,
	tickSpeed,
	adminList,
	generateMap,
	generateMapPerlin,
	getLocalMap,
	makeImage,
	declareWar,
	government,
	location,
	economy,
	cell,
	war,
	gun,
	countries,
	map,
	wars,
	guns
} = require("./struct/vars.js");
// ##########################
//    Functions and Config
// ##########################
/*
const {
	formatMass,
	save,
	recursiveWait,
	getOwnedCells,
	loadGuns,
	saveImage
} = require("./modules/util.js");
const {
	token,
	call,
	width,
	height,
	tickSpeed,
	adminList
} = require("./config.js");
const {
	generateMap,
	generateMapPerlin,
	getLocalMap
} = require("./modules/map.js");
const {
	makeImage
} = require("./modules/canvas-map-gen.js");
const {
	declareWar
} = require("./modules/war.js");

// ########################
//          Commands
// ########################

// ########################
//          Classes
// ########################

const government = require("./struct/Government.js");
const location = require("./struct/Location.js");
const economy = require("./struct/Economy.js");
const cell = require("./struct/Cell.js");
const war = require("./struct/War.js");
const gun = require("./struct/Gun.js");
// ########################
//           Vars
// ########################

let economies = {};
let governments = {};

let countries = {};
let map = {};

var wars = {};
let guns = {};

//temp placement, move to a new file later
/*
guns["M1"] = new gun("M1");
guns["M1"].counters = ["AK47","Minigun","Shotgun"];
guns["M1"].modifier = 1.2;
guns["M1"].cost = 15;

guns["AK47"] = new gun("AK47");
guns["AK47"].cost = 6;
guns["AK47"].counters = ["Rocks","AWP"];

guns["Rocks"] = new gun("Rocks");
guns["Rocks"].counters = ["M1","AWP","Shotgun"];
guns["Rocks"].cost = 1;
guns["Rocks"].modifier = 0.5;

guns["Shotgun"] = new gun("Shotgun");
guns["Shotgun"].counters = ["Rocks","M1"];
guns["Shotgun"].modifier = 0.8;
guns["Shotgun"].cost = 8;

guns["AWP"] = new gun("AWP");
guns["AWP"].counters = ["Rocks","M1","Shotgun","Minigun"];
guns["AWP"].modifier = 1.5;
guns["AWP"].cost = 30;

guns["Minigun"] = new gun("Minigun");
guns["Minigun"].counters = ["AK47","Rocks","Shotgun"];
guns["Minigun"].modifier = 1.2;
guns["Minigun"].cost = 15;
*/
/*
loadGuns().then(g => guns = g);
*/
try {
	console.log("[LOADING DATA]");
	if(map == undefined){
		console.log("[FAILED TO LOAD, CREATING DATA]");

		map = generateMapPerlin();
		save(countries, map);
	}

} catch (err) {
	console.log("[FAILED TO LOAD, CREATING DATA]");

	map = generateMapPerlin();
	save(countries, map);
}

//###############################
//#            Tick             #
//###############################

function tick(repeat) {

	//###############################
	//#     Generate daily-news     #
	//###############################

	var report = "";
	console.log("`===================================");
	console.log("   Today is a new day");
	//client.channels.find("id","386688984845123587").send("A day has passed!");
	report += "========================\n";
	report += "Daily news! (V"+commitCount('https://github.com/xXDerpyXx/advanced-countries')+")\n";
	report += "------------------------\n";

	warVictories = {};
	popGrowth = {};
	armorment = {};

	for (c in countries) {
		countries[c].ownedCells = getOwnedCells(countries[c], map, countries);
		popGrowth[c] = {};
		popGrowth[c]["start"] = countries[c].population.size;
		armorment[c] = {};
		if (countries[c].gun == undefined) {
			countries[c].gun = guns["m1"];
		}
		var cMilitaryPop = Math.round((countries[c].population.size * countries[c].population.manpower) / 100);
		var armedPercent = 1;
		/*if (countries.resource < countries[c].gun.cost * cMilitaryPop) {

		}*/
		armedPercent = countries[c].resource / (cMilitaryPop * countries[c].gun.cost);
		if (armedPercent > 1) {
			armedPercent = 1;
		}

		countries[c].resource -= Math.round(countries[c].gun.cost * cMilitaryPop) * armedPercent;
		if (countries[c].resource < 0)
			countries[c].resource = 0;
		armorment[c]["percent"] = armedPercent;
		if (countries[c].genocidePercent != undefined) {
			countries[c].population.size = countries[c].population.size - (countries[c].population.size * countries[c].genocidePercent);
		}
	}

	for (x in map) {
		for (y in map[x]) {
			if (countries[map[x][y].owner] != undefined) {
				countries[map[x][y].owner].resource += map[x][y].resource;
				if (countries[map[x][y].owner].population.size > countries[map[x][y].owner].ownedCells * 1000) {
					countries[map[x][y].owner].population.size = countries[map[x][y].owner].ownedCells * 1000;
				}
			}
		}
	}

	for (c in countries) {
		if (countries[c].population.size < 1) {
			report += countries[c].name + " HAS FALLEN!!! <@" + c + ">\n";
			//client.channels.find("id","386688984845123587").send(countries[c].name+" HAS FALLEN!!! <@"+c+">");
			//console.log(countries[c].name+" fell due to population concerns: "+countries[c].population.size);
			for (x in map) {
				for (y in map[x]) {
					if (map[x][y].owner == c) {
						map[x][y].owner = "none";
					}
				}
			}

			delete countries[c];

		} else {
			countries[c].population.size += Math.round(countries[c].population.size * 0.01);
			if (countries[c].population.size > countries[c].ownedCells * 1000) {
				countries[c].population.size = countries[c].ownedCells * 1000;
			}
		}
	}

	var wcount = 0;
	for (w in wars) wcount++;
	//report += "------------------------\n";
	console.log("there are " + wcount + " wars currently");

	for (w in wars) {
		try {
			if (map[wars[w].x][wars[w].y].elevation > 0 && map[wars[w].x][wars[w].y].elevation < 10 && (countries[wars[w].attacker].population.manpower) * 10 > (Math.random() * (map[wars[w].x][wars[w].y].elevation))) {
				if (map[wars[w].x][wars[w].y].owner == "none") {
					if (Math.random() < 0.8) {
						map[wars[w].x][wars[w].y].owner = wars[w].attacker;
					}
				} else {
					for (var x = parseInt(wars[w].x) - 1; x < parseInt(wars[w].x) + 2; x++) {
						for (var y = parseInt(wars[w].y) - 1; y < parseInt(wars[w].y) + 2; y++) {
							try {//lol
								if (map[x][y].owner == wars[w].attacker) { //one sec, brb

									var tForce = ((((countries[map[x][y].owner].population.size * countries[map[x][y].owner].population.manpower) / (countries[map[x][y].owner].ownedCells) * 1.25) * (Math.random() * 2)) * armorment[wars[w].attacker].percent) * countries[wars[w].attacker].gun.modifier;
									if (countries[wars[w].attacker].gun.counters.includes(countries[wars[w].defender].gun.name)) {
										tForce = tForce * 1.5;
									}
									wars[w].aForce += tForce;

								}

								if (wars[w].defender != "none") {
									if (map[x][y].owner == wars[w].defender) {
										var tForce = ((((countries[map[x][y].owner].population.size * countries[map[x][y].owner].population.manpower) / (countries[map[x][y].owner].ownedCells)) * (Math.random() * 2)) * armorment[wars[w].defender].percent) * countries[wars[w].defender].gun.modifier;
										if (countries[wars[w].defender].gun.counters.includes(countries[wars[w].attacker].gun.name)) {
											tForce = tForce * 1.5;
										}
										wars[w].dForce += tForce;
									}
								}
							} catch (err) {
								console.log(err.toString());
							}
						}
					}
					//client.channels.find("id","386688984845123587").send("War, "+wars[w].aForce+" force vs "+wars[w].dForce+" force");
					if (wars[w].aForce > wars[w].dForce && Math.random() < 0.8) {
						//client.channels.find("id","386688984845123587").send("War won by "+countries[wars[w].attacker].name+", won with "+wars[w].aForce+" force");
						if (warVictories[wars[w].attacker] == undefined) {
							warVictories[wars[w].attacker] = 1;
						} else {
							warVictories[wars[w].attacker] += 1;
						}

						map[wars[w].x][wars[w].y].owner = wars[w].attacker;
						if (wars[w].defender != "none") {
							countries[wars[w].attacker].population.size -= (((countries[wars[w].attacker].population.size * countries[wars[w].attacker].population.manpower) / (countries[wars[w].attacker].ownedCells)) * 1);
							countries[wars[w].defender].population.size -= (((countries[wars[w].defender].population.size * countries[wars[w].defender].population.manpower) / (countries[wars[w].defender].ownedCells)) * 0.5);
						}

						if (wars[w].defender != "none") {
							if (wars[w].x == countries[wars[w].defender].capital.x && wars[w].y == countries[wars[w].defender].capital.y) {
								//client.channels.find("id","386688984845123587").send(countries[wars[w].defender].name+" HAS FALLEN!!! <@"+wars[w].defender+">");
								for (x in map) {
									for (y in map[x]) {
										if (map[x][y].owner == wars[w].defender) {
											map[x][y].owner = "none";
										}
									}
								}
								report += countries[wars[w].defender].name + " HAS FALLEN!!! <@" + wars[w].defender + ">\n";

								delete countries[wars[w].defender];

								if (countries[v].name != undefined) {
									tempCount++;
									try {
										report += countries[v].name + " claimed " + warVictories[v] + " cells of land\n";
									} catch (err) {
										console.log(err.toString());
									}
								}
								//console.log(countries[wars[w].defender].name+" fell due to loosing a war");

							}
						}
						var tempd = "none";
						if (wars[w].defender != "none") tempd = countries[wars[w].defender].name;
						console.log(countries[wars[w].attacker].name + ":" + wars[w].aForce + " captured " + wars[w].x + "," + wars[w].y + " from " + tempd + ":" + wars[w].dForce);
					} else {
						//client.channels.find("id","386688984845123587").send("War lost by "+countries[wars[w].attacker].name+", lost to "+wars[w].dForce+" force");
						//console.log(countries[wars[w].defender].name+":"+wars[w].dForce+" defended "+wars[w].x+","+wars[w].y+" from "+countries[wars[w].attacker].name+":"+wars[w].aForce);
						if (countries[wars[w].defender] != undefined) {
							countries[wars[w].attacker].population.size -= (((countries[wars[w].attacker].population.size * countries[wars[w].attacker].population.manpower) / (countries[wars[w].attacker].ownedCells)) * 1);
							countries[wars[w].defender].population.size -= (((countries[wars[w].defender].population.size * countries[wars[w].defender].population.manpower) / (countries[wars[w].defender].ownedCells)) * 0.5);
						}
					}
				}
			}
		} catch (err) {
			console.log(err.toString());
		}
		//countries[w.attacker].name);

		delete wars[w];
	}

	var tempCount = 0;

	for (v in warVictories) {
		try {
			if (countries[v].name != undefined) {
				tempCount++;

				try {
					report += countries[v].name + " claimed " + warVictories[v] + " cells of land\n";
				} catch (err) {
					console.log(err.toString());
				}
			}
		} catch (err) {
			console.log(err.toString());
		}

	}
	if (tempCount == 0) report += "The world is at peace!\n";

	report += "------------------------\n";
	report += "Census ( Average force per cell )\n";
	report += "------------------------\n";

	var forceList = [];
	var f = -1;

	for (c in countries) {
		countries[c].ownedCells = getOwnedCells(countries[c], map, countries);
		f++;
		forceList[f] = {};
		forceList[f]["name"] = countries[c].name;
		forceList[f]["force"] = (countries[c].population.size * countries[c].population.manpower) / (countries[c].ownedCells);
	}

	for (var j = 0; j < forceList.length; j++) {
		for (var i = 0; i < forceList.length - 1; i++) {
			if (forceList[i].force < forceList[i + 1].force) {
				var temp = forceList[i + 1];
				forceList[i + 1] = forceList[i];
				forceList[i] = temp;
			}
		}
	}

	for (var f = 0; f < forceList.length; f++) {
		report += forceList[f].name + ": " + (Math.round(forceList[f].force * 100) / 100) + "\n";
	}

	report += "------------------------\n";
	report += "   Population Growth\n";
	report += "------------------------\n";

	for (c in countries) {
		prefix = "";

		if (countries[c].population.size - popGrowth[c]["start"] > 0) {
			prefix = "+";
		}

		report += countries[c].name + ": " + prefix + (countries[c].population.size - popGrowth[c]["start"]) + "\n";
	}

	report += "========================`\n";

	client.guilds.first().channels.find("name", "daily-news").send(report);
	//WARNING: IMPORTANT FEATURE COMMING UP. BE CAREFUL



	/*IMPORTANT FEATURE*/
  //client.guilds.first().channels.find("name", "general").send("It is a new day ☭***c o m r a d e s***☭!"); //VERY IMPORTANT
	/*DO NOT REMOVE*/



	//IMPORTANT FEATURE ZONE ENDS HERE
	saveImage(map, wars, countries);
	save(countries, map);
	//no >:(
	if (repeat) {
		setTimeout(() => {
			tick(true);
		}, tickSpeed);
	}
}

//###############################
//#        Message Event        #
//###############################
client.on("error", console.error);
client.on("warn", console.warn);
client.on("disconnect", () => { console.warn("Disconnected!"); });
client.on("reconnecting", () => { console.warn("Reconecting..."); });
client.on("commandError", (cmd, err) => {
	client.channels.find("name", "spam").send(err.toString()); //
	if(err instanceof Commando.FriendlyError) return;//hold up. cant we use like the dev console? and add a tab with irc?
	console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
});
client.on("commandBlocked", (msg, reason) => {
	console.log(oneLine`
		Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ""}
		blocked; ${reason}
	`);
});
client.on("commandPrefixChange", (guild, prefix) => {
	console.log(oneLine`
		Prefix ${prefix === "" ? "removed" : `changed to ${prefix || "the default"}`}
		${guild ? `in guild ${guild.name} (${guild.id})` : "globally"}.
	`);
});
client.on("commandStatusChange", (guild, command, enabled) => {
	console.log(oneLine`
		Command ${command.groupID}:${command.memberName}
		${enabled ? "enabled" : "disabled"}
		${guild ? `in guild ${guild.name} (${guild.id})` : "globally"}.
	`);
});
client.on("groupStatusChange", (guild, group, enabled) => {
	console.log(oneLine`
		Group ${group.id}
		${enabled ? "enabled" : "disabled"}
		${guild ? `in guild ${guild.name} (${guild.id})` : "globally"}.
	`);
});









client.on("message", msg => {
	try {
		id = msg.author.id;
		c = countries[id];
		content = msg.content.toLowerCase().split(" ");
		if (adminList.includes(msg.author.id)) { // == "246589957165023232" || msg.author.id == "338914218470539266" || msg.author.id == "185975071603556352"){
			if (content[0] == call + "tick") {
				tick(false);
				msg.channel.send("tick forced!!! do not do this unless bugfixing!!!");
			}

			if (content[0] == call + "destroy") {
				target = content[1];
				msg.channel.send(countries[target].name + " got frickin' nuked");
				for (var x in map) {
					for (var y in map[x]) {
						if (map[x][y].owner == target) {
							map[x][y].owner = "none";
						}
					}
				}
				delete countries[target];
			}

			if (content[0] == call + "forcerename") {
				countries[content[1]].name = msg.content.split(" ")[2];
				msg.channel.send("you were renamed <@" + content[1] + ">");
			}

			if (content[0] == call + "setstat") {
				target = content[1];
				value = content[2];
				things = {};
				msg.channel.send("setting");
				for (k in content) {
					if (k != 0 && k != 1 && k != 2) {
						things[k] = {};
						things[k]["prop"] = content[k];
						msg.channel.send(content[k]);
					}
				}
				msg.channel.send("to " + value);
				if (things[4] != undefined) {
					countries[target][things[3].prop][things[4].prop] = parseFloat(countries[target][things[3].prop][things[4].prop]);
					countries[target][things[3].prop][things[4].prop] = parseFloat(value);
				} else {
					if (things[3] != undefined) {
						countries[target][things[3].prop] = value;
					}
				}
			}

		}
	} catch (err) {
		console.log(err);
		msg.channel.send("Ow! error!");
	}
});

//###############################
//#         Ready Event         #
//###############################

client.on("ready", () => {
	console.log(`Client ready; logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`);
	setTimeout(() => tick(true), 1000);
});




class country {
	constructor(id, name, chosenEconomy = "capitalist", chosenGov = "dictatorship") {
		this.id = id;
		this.name = name;
		this.owner = client.users.get(id).tag;
		this.allies = [];
		this.economyType = chosenEconomy;
		this.governmentType = chosenGov;
		this.resource = 0;
		this.allies[0] = id;
		this.population = {};
		this.ownedCells = 0;
		this.genocidePercent = 0.0;
		this.population.size = 1000;
		this.population.loyalty = 1;
		this.population.sway = 0;
		this.population.manpower = 0.2;
		this.inFaction = false;
		this.faction = "none";
		this.capital = new location(Math.round(Math.random() * width), Math.round(Math.random() * height));
		//this.capital = new location(11, 15);
		console.log(this.capital.x, this.capital.y);
		var owner = map[this.capital.x][this.capital.y].owner;
		let tries = 0;

		while (map[this.capital.x][this.capital.y].elevation > 4 || map[this.capital.x][this.capital.y].elevation < 0) {
			this.capital = new location(Math.round(Math.random() * width), Math.round(Math.random() * height));
		}

		if (owner != "none") {
			while (owner != "none") { //&& tries < 200){
				this.capital = new location(Math.round(Math.random() * width), Math.round(Math.random() * height));
				try {
					owner = map[this.capital.x][this.capital.y].owner;
					if (map[this.capital.x][this.capital.y].elevation > 3 && map[this.capital.x][this.capital.y].elevation < 0) {
						owner = "";
					}
				} catch (err) {
					console.log(err.toString());
				}

				tries++;
			}
		}
		if (tries > 1999) {
			this.population.size = 0;
		} else {
			for (var x = this.capital.x - 2; x < this.capital.x + 3; x++) {
				for (var y = this.capital.y - 2; y < this.capital.y + 3; y++) {
					try {
						if (map[x][y].owner == "none" && map[x][y].elevation < 10 && map[x][y].elevation > 0) {
							map[x][y].owner = id;
						}
					} catch (err) {
						console.log(err.toString());
					}
				}
			}

			for (var x = this.capital.x - 1; x < this.capital.x + 2; x++) {
				for (var y = this.capital.y - 1; y < this.capital.y + 2; y++) {
					try {
						map[x][y].owner = id;
					} catch (err) {
						console.log(err.toString());
					}
				}
			}

			map[this.capital.x][this.capital.y].owner = id;
			save(countries, map);
		}
	}
}  // Country Structure




//###############################
//#            Login            #
//###############################
exports.country = country;
client.login(token);
