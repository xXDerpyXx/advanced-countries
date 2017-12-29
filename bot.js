/*jshint esversion: 6 */
// ##########################
//       Dependencies
// ##########################

const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");

// ##########################
//    Functions and Config
// ##########################

const {
	formatMass,
	save,
	recursiveWait,
	getOwnedCells,
	loadGuns,
	saveImage
} = require("./modules/util.js")
const {
	token,
	call,
	width,
	height,
	tickSpeed,
	adminList
} = require('./config.js')
const {
	generateMap,
	getLocalMap
} = require('./modules/map.js')
const {
	makeImage
} = require("./modules/canvas-map-gen.js");
const {
	declareWar
} = require("./modules/war.js");

// ########################
//          Commands
// ########################

const commands = require("./modules/commands.js");

// ########################
//          Classes
// ########################

const government = require('./struct/Government.js');
const location = require('./struct/Location.js');
const economy = require('./struct/Economy.js');
const cell = require('./struct/Cell.js');
const war = require('./struct/War.js');
const gun = require('./struct/Gun.js');

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

loadGuns().then(g => guns = g);

try {
	console.log("[LOADING DATA]");

	countries = require("./data/data.json");
	map = require("./data/map.json");
} catch (err) {
	console.log("[FAILED TO LOAD, CREATING DATA]");

	map = generateMap()
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
	console.log("===================================");
	console.log("   Today is a new day")
	//client.channels.find("id","386688984845123587").send("A day has passed!");
	report += "========================\n";
	report += "Daily news!\n";
	report += "========================\n";

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
		if (countries.resource < countries[c].gun.cost * cMilitaryPop) {

		}
		armedPercent = countries[c].resource / (cMilitaryPop * countries[c].gun.cost);
		if (armedPercent > 1) {
			armedPercent = 1;
		}

		countries[c].resource -= Math.round(countries[c].gun.cost * cMilitaryPop) * armedPercent;
		if (countries[c].resource < 0)
			countries[c].resource = 0;
		armorment[c]["percent"] = armedPercent;
		if (countries[c].genocidePercent == undefined) {} else {
			countries[c].population.size = countries[c].population.size - (countries[c].population.size * countries[c].genocidePercent);
		}
	}

	for (x in map) {
		for (y in map[x]) {
			if (countries[map[x][y].owner] != undefined) {
				countries[map[x][y].owner].resource += map[x][y].resource;
				if (countries[map[x][y].owner].population.size > countries[map[x][y].owner].ownedCells * 1000) {
					countries[map[x][y].owner].population.size = countries[map[x][y].owner].ownedCells * 1000
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
				countries[c].population.size = countries[c].ownedCells * 1000
			}
		}
	}

	var wcount = 0;
	for (w in wars) wcount++;

	console.log("===================================");
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
							try {
								if (map[x][y].owner == wars[w].attacker) {

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

				}
			}
		} catch (err) {

		}

	}
	if (tempCount == 0) report += "The world is at peace!\n";

	report += "========================\n";
	report += "Census ( Average force per cell )\n";
	report += "========================\n";

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

	report += "========================\n";
	report += "   Population Growth\n";
	report += "========================\n";

	for (c in countries) {
		prefix = "";

		if (countries[c].population.size - popGrowth[c]["start"] > 0) {
			prefix = "+";
		}

		report += countries[c].name + ": " + prefix + (countries[c].population.size - popGrowth[c]["start"]) + "\n";
	}

	report += "========================\n";

	client.guilds.first().channels.find("name", "daily-news").send(report);

	saveImage(map, wars, countries)
	save(countries, map);

	if (repeat) {
		setTimeout(() => {
			tick(true);
		}, tickSpeed);
	}
}

//###############################
//#        Message Event        #
//###############################

client.on('message', msg => {
	try {
		id = msg.author.id;
		c = countries[id];
		content = msg.content.toLowerCase().split(" ");

		//###############################
		//#        !makecountry         #
		//###############################

		if (c == undefined) {
			if (content[0] == call + "makecountry") {
				//console.log(content[1]);
				if (content[1] == undefined && content[1].charCodeAt(0) <= 255 && content[0].length > 1 && content[1].charAt(0) != "X" && content[1].charAt(0) != "*" && content[1].charAt(0) != "#" && !content[1].includes("@")) {
					msg.channel.send("You need to specify a name! `" + call + "makecountry [name] [economy type] [government type]` and the first char has to be ascii");

				} else if (content[2] != "communist" && content[2] != "capitalist" && content[2] != "meritist" && content[2] != undefined) {
					msg.channel.send("That isn't an economy type! Types: capitalist, communist, or meritist. Say nothing for capitalist");
				} else if (content[3] != "republic" && content[3] != "monarchy" && content[3] != "dictatorship" && content[3] != "facist" && content[3] != "democracy" && content[3] != undefined) {
					msg.channel.send("That isn't a government type! Types: republic, dictatorship, monarchy, democracy, or facist. Say nothing for dictatorship");
				} else {
					countries[id] = new country(id, content[1], content[2], content[3]);
					msg.channel.send("You've created the country of " + msg.content.split(" ")[1]);
					save(countries, map);
				}
			}

		} else {

			//###############################
			//#         !givepeople         #
			//###############################

			if (content[0] == call + "givepeople") {
				if (content[1] != undefined) {
					if (content[2] != undefined) {
						if (parseInt(content[2]) == content[2] && parseInt(content[2]) + " " != "NaN ") {
							var found = false;
							var c = "";
							for (k in countries) {
								if (countries[k].name.toLowerCase() == content[1]) {
									found = true;
									c = k;
								}
							}
							if (found) {
								if (countries[id].population.size >= parseInt(content[2])) {
									msg.channel.send("giving " + countries[c].name + " " + content[2] + " people!");
									countries[id].population.size -= parseInt(content[2]);
									countries[c].population.size += parseInt(content[2]);
								} else {
									msg.channel.send("you don't even have that many people!");
								}
							} else {
								msg.channel.send("They don't exist!");
							}


						} else {
							msg.channel.send("That's not a number...");
						}
					} else {
						msg.channel.send("you need to specify how much to give, `!givepeople [target] [amount]`");
					}
				} else {
					msg.channel.send("you need to specify who to give people to, `!givepeople [target] [amount]`");
				}
			}

			//###############################
			//#        !giveresource        #
			//###############################

			if (content[0] == call + "giveresource") {
				if (content[1] != undefined) {
					if (content[2] != undefined) {
						if (parseInt(content[2]) == content[2] && parseInt(content[2]) + " " != "NaN ") {
							var found = false;
							var c = "";
							for (k in countries) {
								if (countries[k].name.toLowerCase() == content[1]) {
									found = true;
									c = k;
								}
							}
							if (found) {
								if (countries[id].resource >= parseInt(content[2])) {
									msg.channel.send("giving " + countries[c].name + " " + content[2] + " resource!");
									countries[id].resource -= parseInt(content[2]);
									countries[c].resource += parseInt(content[2]);
								} else {
									msg.channel.send("you don't even have that much resource!");
								}
							} else {
								msg.channel.send("They don't exist!");
							}


						} else {
							msg.channel.send("That's not a number...");
						}
					} else {
						msg.channel.send("you need to specify how much to give, `!giveresource [target] [amount]`");
					}
				} else {
					msg.channel.send("you need to specify who to give resource to, `!giveresource [target] [amount]`");
				}
			}


			//###############################
			//#          !setgun            #
			//###############################

			if (content[0] == call + "setgun") {
				if (content[1] != null) {
					if (guns[content[1]] != undefined) {
						msg.channel.send("gun set!");
						countries[id].gun = guns[content[1]];
						countries[id].resource = countries[id].resource - (countries[id].resource * 0.1);
					} else {
						msg.channel.send(content[1] + " is not a gun that exists");
					}
				} else {
					msg.channel.send("Specify the gun you want used");
				}
			}

			//###############################
			//#            !guns            #
			//###############################

			if (content[0] == call + "guns") {
				var temp = "";
				temp += "List of avalible guns\n";
				temp += "=====================\n";

				for (k in guns) {
					temp += "-------\n"
					temp += guns[k].name + "\n";
					temp += "-------\n"
					temp += "Counters: " + guns[k].counters + "\n";
					temp += "Costs: " + guns[k].cost + " per 100 troops\n";
					temp += "General Strength: " + guns[k].modifier + "\n";
					//temp+="-------\n"
				}
				temp += "=====================\n";
				msg.channel.send(temp);
			}

			//###############################
			//#            !list            #
			//###############################

			if (content[0] == call + "list") {
				temp = "";
				for (k in countries) {
					temp += countries[k].name + "\n";
				}
				msg.channel.send("List of countries:\n" + temp);
			}

			//###############################
			//#           !allies           #
			//###############################

			if (content[0] == call + "allies") {
				if (msg.mentions.members.first()) id = msg.mentions.members.first().id

				temp = "";
				for (k in countries[id].allies) {
					try {
						temp += "" + countries[countries[id].allies[k]].name + "\n";
					} catch (err) {
						console.log(k + " had an error, it's ID = " + countries[id].allies[k]);
					}
				}
				msg.channel.send(temp);
			}

			//###############################
			//#            !ally            #
			//###############################

			if (content[0] == call + "ally") {
				var foundAlly = false;
				for (k in countries) {
					//console.log(countries[k].name);
					if (countries[k].name.toLowerCase() == content[1]) {
						countries[id].allies[countries[id].allies.length] = countries[k].id;
						msg.channel.send("You now have allied " + content[1]);
						foundAlly = true;
					}
				}
				if (!foundAlly) {
					msg.channel.send("They dont exist!");
				}
			}

			//###############################
			//#          !giveland          #
			//###############################

			if (content[0] == call + "giveland") {
				var foundTarget = false;
				var target = "";
				for (k in countries) {
					//console.log(countries[k].name);
					if (countries[k].name.toLowerCase() == content[1]) {
						target = k;
						foundTarget = true;
					}
				}
				if (!foundTarget) {
					msg.channel.send("They dont exist!");
				} else {
					if (parseInt(content[2]) == content[2] && parseInt(content[3]) == content[3] && parseInt(content[4]) == content[4]) {
						var targetX = parseInt(content[3]);
						var targetY = parseInt(content[2]);
						var size = Math.floor(parseInt(content[4]) / 2);
						var givenLand = 0;
						for (var x = targetX - size; x < targetX + size + 1; x++) {
							for (var y = targetY - size; y < targetY + size + 1; y++) {
								try {
									if (map[x][y].owner == id) {
										map[x][y].owner = target;
										givenLand++;
									}
								} catch (err) {

								}
							}
						}
						msg.channel.send("you gave " + countries[target].name + " " + givenLand + " cells");
					} else {
						msg.channel.send("you need the x, y and size, !giveland [country] [x] [y] [size]");
					}
				}
			}

			//###############################
			//#           !force            #
			//###############################

			if (content[0] == call + "force") {
				var toSend = ""
				if (msg.mentions.members.first()) id = msg.mentions.members.first().id
				toSend += `${msg.mentions.members.first() ? msg.mentions.members.first().toString() + " has " : 'You have '}` + (((countries[id].population.size * countries[id].population.manpower) / (countries[id].ownedCells)) * countries[id].gun.modifier) + " force on average per cell";
				if (countries[id].gun == undefined) {
					countries[id].gun = guns["M1"];
				}
				var cMilitaryPop = Math.round((countries[id].population.size * countries[id].population.manpower) / 100);
				var armedPercent = 1;
				if (countries.resource < countries[id].gun.cost * cMilitaryPop) {

				}
				armedPercent = countries[id].resource / (cMilitaryPop * countries[id].gun.cost);
				if (armedPercent > 1) {
					armedPercent = 1;
				}
				var cost = Math.round(countries[id].gun.cost * cMilitaryPop) * armedPercent;
				if (content[1] == "webint") {
					msg.channel.send(toSend + "\nYour army is armed with " + countries[id].gun.name + " and you can give " + Math.round(armedPercent * 100) + "% of your " + (cMilitaryPop * 100) + " troops, this gun for the cost of " + Math.round(cost) + " resource\n" + msg.author.id + "WEBINT_FORCE");
				} else {
					msg.channel.send(toSend + "\nYour army is armed with " + countries[id].gun.name + " and you can give " + Math.round(armedPercent * 100) + "% of your " + (cMilitaryPop * 100) + " troops, this gun for the cost of " + Math.round(cost) + " resource");
				}
			}

			//###############################
			//#         !resource           #
			//###############################

			if (content[0] == call + "resource") {
				var temp = "";
				if (msg.mentions.members.first()) id = msg.mentions.members.first().id
				temp += (`${msg.mentions.members.first() ? msg.mentions.members.first().toString() + " has " : 'You have '}` + countries[id].resource + " resource\n");
				var total = 0;
				for (x in map) {
					for (y in map[x]) {
						try {
							if (map[x][y].owner == id) {
								total += map[x][y].resource;
							}
						} catch (err) {

						}
					}
				}

				if (countries[id].gun == undefined) {
					countries[id].gun = guns["M1"];
				}
				var cMilitaryPop = Math.round((countries[id].population.size * countries[id].population.manpower) / 100);
				var armedPercent = 1;
				if (countries.resource < countries[id].gun.cost * cMilitaryPop) {

				}
				armedPercent = countries[id].resource / (cMilitaryPop * countries[id].gun.cost);
				if (armedPercent > 1) {
					armedPercent = 1;
				}
				var cost = Math.round(countries[id].gun.cost * cMilitaryPop) * armedPercent;
				var profit = total - cost;
				temp += ("you mine " + Math.round(total) + " resource per turn\n");
				temp += ("and spend " + Math.round(cost) + " per turn on weapons\n");
				temp += ("leaving you with " + Math.round(profit) + " per turn\n");
				if (content[1] == "webint") {
					msg.channel.send(temp + msg.author.id + "WEBINT_RESOURCE");
				} else {
					msg.channel.send(temp);
				}
			}

			//###############################
			//#           !color            #
			//###############################

			if (content[0] == call + "color") {
				if (content[1] != undefined && content[2] != undefined && content[3] != undefined) {
					if (parseInt(content[1]) < 0 || parseInt(content[2]) < 0 || parseInt(content[3]) < 0) {
						msg.channel.send("R, G and B needs to be 0 or more!");
					} else if (content[1] == "null" || content[2] == "null" || content[3] == "null" || content[1] == "nan" || content[2] == "nan" || content[3] == "nan") {
						msg.channel.send("No nulls please!");
					} else {
						if (parseInt(content[1]) > 255 || parseInt(content[2]) > 255 || parseInt(content[3]) > 255) {
							msg.channel.send("R, G and B needs to be less than 256!");
						} else {
							msg.channel.send("Map color set!");
							countries[id].color = {};
							countries[id].color.r = parseInt(content[1]);
							countries[id].color.g = parseInt(content[2]);
							countries[id].color.b = parseInt(content[3]);

						}
					}
				} else {
					msg.channel.send("You need an R, G, and B value");
				}

			}

			//###############################
			//#         	!map            #
			//###############################

			if (content[0] == call + "map") {
				if (msg.mentions.members.first()) id = msg.mentions.members.first().id, c = countries[id];

				var x = content[1];
				var y = content[2];
				if (x == null || y == null) {
					x = c.capital.x;
					y = c.capital.y;
				} else {
					x = parseInt(content[1]);
					y = parseInt(content[2]);
				}
				size = 10;
				if (content[3] != undefined) {
					size = parseInt(content[3]);
				} else size = 10;

				if (content[1] != undefined && content[2] == undefined && !isNaN(content[1]))
					size = parseInt(content[1]);

				console.log(size)
				if (size <= 0) {
					msg.channel.send("Don't use negatives, silly...");
				} else {
					let buffer = makeImage(map, wars, x - size, y - size, parseInt(x) + size, parseInt(y) + size, countries);

					setTimeout(function () {
						msg.channel.send(`Center of ${x} ${y}`, {
							files: [{
								attachment: buffer,
								name: `${x}-${y}.png`,
							}],
						});
					}, 500);
				}
				//msg.channel.send("```markdown\n"+getLocalMap(x,y,11,11,c)+"```");
				//msg.channel.send("Center of ("+y+","+x+")");
			}

			//###############################
			//#           !stats            #
			//###############################

			if (content[0] == call + "stats") {
				if (msg.mentions.members.first()) id = msg.mentions.members.first().id, c = countries[id];

				var temp = "";
				for (k in c) {
					temp += k + ": " + c[k] + "\n";
				}
				for (k in c.population) {
					temp += k + ": " + c.population[k] + "\n";
				}
				msg.channel.send(temp);
			}

			//###############################
			//#        !movecapital         #
			//###############################

			if (content[0] == call + "movecapital") {
				if (map[content[2]][content[1]].owner == id) {
					countries[id].capital.x = content[2];
					countries[id].capital.y = content[1];
					msg.channel.send("Capital moved!");
				} else {
					msg.channel.send("You don't own that land!");
				}

			}

			//###############################
			//#           !rename           #
			//###############################

			if (content[0] == call + "rename") {
				if (content[1] != undefined && content[1].charCodeAt(0) <= 255 && content[0].length > 1 && content[1].charAt(0) != "X" && content[1].charAt(0) != "*" && content[1].charAt(0) != "#" && !content[1].includes("@")) {
					msg.channel.send("The country of " + countries[id].name + " is now " + msg.content.split(" ")[1]);
					countries[id].name = msg.content.split(" ")[1];
					save(countries, map);
				} else {
					msg.channel.send("You need a real name....");
				}
			}

			//###############################
			//#          !manpower          #
			//###############################

			if (content[0] == call + "manpower") {
				if (content[1] != undefined) {
					if (content[1] <= 100) {
						if (content[1] >= 0) {
							countries[id].population.manpower = parseFloat(content[1] / 100);
							msg.channel.send("Manpower set to " + content[1] + "%");
							save(countries, map);
						} else {
							msg.channel.send("Manpower too low!");
						}
					} else {
						msg.channel.send("Manpower too high!");
					}
				} else {
					msg.channel.send("You need to give a valid percentage, `" + call + "manpower 25` will set manpower at 25% of your population");

				}
			}

			//###############################
			//#          !economy           #
			//###############################

			if (content[0] == call + "economy") {
				if (content[1] != undefined) {
					try {
						if (content[1] == "capitalist") {
							countries[id].economyType = "capitalist";
							save(countries, map);
							msg.channel.send("Economy set!");
						} else if (content[1] == "communist") {
							countries[id].economyType = "communist";
							save(countries, map);
							msg.channel.send("Economy set!");
						} else if (content[1] == "meritist") {
							countries[id].economyType = "meritist";
							save(countries, map);
							msg.channel.send("Economy set!");
						} else {
							msg.channel.send("Sorry, you can only be capitalist, communist, or meritist.")
						}
					} catch (err) {
						msg.channel.send("Ow! Error!");
					}
				} else {
					msg.channel.send("Options: capitalist, communist, or meritist.");
				}
			}

			//###############################
			//#        !government          #
			//###############################

			if (content[0] == call + "government") {
				if (content[1] != undefined) {
					try {
						if (content[1] == "facist") {
							countries[id].governmentType = "facist";
							countries[id].loyalty = 0;
							countries[id].sway = -0.5;
							save(countries, map);
							msg.channel.send("Government type set!");
						} else if (content[1] == "dictatorship") {
							countries[id].governmentType = "dictatorship";
							countries[id].genocidePercent = 0;
							countries[id].loyalty = 0;
							countries[id].sway = -0.5;
							save(countries, map);
							msg.channel.send("Government type set!");
						} else if (content[1] == "monarchy") {
							countries[id].governmentType = "monarchy";
							countries[id].genocidePercent = 0;
							countries[id].loyalty = 0;
							countries[id].sway = -0.5;
							save(countries, map);
							msg.channel.send("Government type set!");
						} else if (content[1] == "democracy") {
							countries[id].governmentType = "democracy";
							countries[id].genocidePercent = 0;
							countries[id].loyalty = 0;
							countries[id].sway = -0.5;
							save(countries, map);
							msg.channel.send("Government type set!");
						} else if (content[1] == "republic") {
							countries[id].governmentType = "republic";
							countries[id].genocidePercent = 0;
							countries[id].loyalty = 0;
							countries[id].sway = -0.5;
							save(countries, map);
							msg.channel.send("Government type set!");
						} else {
							msg.channel.send("Sorry, you can only be a republic, dictatorship, monarchy, democracy, or a facist.");
						}
					} catch (err) {
						msg.channel.send("Ow! Error!");
					}
				} else {
					msg.channel.send("Options: republic, dictatorship, monarchy, democracy, or facist.");
				}
			}

			//###############################
			//#         !genocide           #
			//###############################

			if (content[0] == call + "genocide") {
				if (countries[id].governmentType = "facist") {
					if (content[1] != undefined) {
						if (content[1] <= 100) {
							if (content[1] >= 0) {
								countries[id].population.genocidePercent = parseFloat(content[1] / 100);
								msg.channel.send("Genocide amount set to " + content[1] + "%");
								save(countries, map);
							} else {
								msg.channel.send("Genocide % too low!");
							}
						} else {
							msg.channel.send("Genocide % too high!");
						}
					} else {
						msg.channel.send("You need to give a valid percentage, `" + call + "genocide 25` will set kill 25% of your population every turn.");

					}
				} else {
					msg.channel.send("Sorry, you have to be facist to use this command.")
				}
			}

			//###############################
			//#            !war             #
			//###############################

			if (content[0] == call + "war") {
				var dir = "";
				var right = 2;
				var left = 1;
				var up = 1;
				var down = 2;
				if (content.includes("north") || content.includes("east") || content.includes("south") || content.includes("west") || content.includes("weast")) /*weast?*/ {
					up = 0;
					down = 1;
					left = 0;
					right = 1;
					if (msg.content.includes("west")) {
						up = 1;
						dir += " west";
					}
					if (msg.content.includes("west")) {
						down = 2;
						dir += " west";
					}
					if (msg.content.includes("south")) {
						right = 2;
						dir += " south";
					}
					if (msg.content.includes("north")) {
						left = 1;
						dir += " north";
					}
					if (msg.content.includes("weast")) {
						left = 1;
						right = 2;
						dir += " weast";
					}
				}


				if (content[1] != undefined) {
					var target = "";
					for (k in countries) {
						try {
							if (countries[k].name.toLowerCase() == content[1]) {
								target = k;
								msg.channel.send("Now at war with " + content[1] + dir);
								break;
							}
						} catch (err) {

						}
					}



					if (target != "") {

						for (var x in map) {
							for (var y in map[x]) {
								var warable = false;
								if (map[x][y].owner == target) {
									for (var i = parseInt(x) - left; i < parseInt(x) + right; i++) {
										for (var j = parseInt(y) - up; j < parseInt(y) + down; j++) {
											try {
												if (map[i][j].owner == id) {
													warable = true;
													break;
												}
											} catch (err) {

											}
										}
									}
								}

								if (warable) {
									declareWar(x, y, id, target, false, wars, map, countries);
								} else {

								}
							}
						}
					} else {
						if (content[1] == "all") {
							for (var x in map) {
								for (var y in map[x]) {
									var warable = false;
									if (map[x][y].owner != id) {
										for (var i = parseInt(x) - left; i < parseInt(x) + (right); i++) {
											for (var j = parseInt(y) - up; j < parseInt(y) + (down); j++) {
												try {
													if (map[i][j].owner == id) {
														warable = true;
														break;
													}
												} catch (err) {

												}
											}
										}
									}

									if (warable) {
										declareWar(x, y, id, map[x][y].owner, false, wars, map, countries);
									} else {

									}
								}
							}
							msg.channel.send("War declared on all non-allies" + dir + "!");
						} else if (content[1] == "none") {
							for (var x in map) {
								for (var y in map[x]) {
									var warable = false;
									if (map[x][y].owner == "none") {
										for (var i = parseInt(x) - left; i < parseInt(x) + (right); i++) {
											for (var j = parseInt(y) - up; j < parseInt(y) + (down); j++) {
												try {
													if (map[i][j].owner == id) {
														warable = true;
														break;
													}
												} catch (err) {

												}
											}
										}
									}

									if (warable) {
										declareWar(x, y, id, map[x][y].owner, false, wars, map, countries);
									} else {

									}
								}
							}
							msg.channel.send("Now claiming all nearby unowned land" + dir + "!");
						} else {
							msg.channel.send("You need to specify where to war, north, east, south, west. or a specific country!");
						}

					}
				} else {
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

			//###############################
			//#       !deletecountry        #
			//###############################

			if (content[0] == call + "deletecountry") {
				for (var x in map) {
					for (var y in map[x]) {
						if (map[x][y].owner == id) {
							map[x][y].owner = "none";
						}
					}
				}
				delete countries[id];
				msg.channel.send("Country disbanded!");
			}

			//###############################
			//#          !fullmap           #
			//###############################

			if (content[0] == call + "fullmap") {
				save(countries, map);
				//msg.author.send('The Whole Map!',  {files: ["./map.txt"]});
				let buffer = makeImage(map, wars, 0, 0, width, height, countries, true);

				setTimeout(function () {
					msg.channel.send("Fullmap:", {
						files: [{
							attachment: buffer,
							name: `map.png`,
						}],
					});
				}, 500);
				//console.log(getLocalMap(width/2,height/2,(width/2)+2,(height/2)+2,"sgkj;ljsfg"));
			}
			if (content[0] == call + "rawdata") {
				save(countries, map);
				//msg.author.send('The Whole Map!',  {files: ["./map.txt"]});
				setTimeout(function () {
					msg.author.send("All the raw data:", {
						files: ["./data/data.json"],
					});
					msg.author.send({
						files: ["./data/map.json"],
					});
				}, 500);
				//console.log(getLocalMap(width/2,height/2,(width/2)+2,(height/2)+2,"sgkj;ljsfg"));
			}

			//###############################
			//#          !allymap           #
			//###############################

			if (content[0] == call + "allymap") {
				var theCountry;
				if (content[1] != undefined) {
					Object.keys(countries).forEach(function (key) {

						if (countries[key].name.toLowerCase() == content[1]) {
							theCountry = countries[key];
						}

					});
				}
				save(countries, map);
				if (content[1] != undefined) {
					let buffer = makeImage(map, wars, 0, 0, width, height, countries, true, true, theCountry.id);

					setTimeout(function () {
						msg.channel.send(`Map of allies for ${theCountry.name}`, {
							files: [{
								attachment: buffer,
								name: `map.png`,
							}],
						});
					}, 500);
				} else {
					//msg.author.send('The Whole Map!',  {files: ["./map.txt"]});
					let buffer = makeImage(map, wars, 0, 0, width, height, countries, true, true, msg.author.id);

					setTimeout(function () {
						msg.channel.send(`Map of allies for ${countries[msg.author.id].name}`, {
							files: [{
								attachment: buffer,
								name: `map.png`,
							}],
						});
					}, 500);
				}
				//console.log(getLocalMap(width/2,height/2,(width/2)+2,(height/2)+2,"sgkj;ljsfg"));
			}

			//###############################
			//#           !unally           # <-- needs fixing, sometimes requires 2 usages of the command to unally someone
			//###############################

			if (content[0] == call + "unally") {
				var foundAlly = false;
				for (k in countries[id].allies) {
					try {
						//console.log(countries[countries[id].allies[k]].name+"|"+content[1]+":"+countries[id].allies[k]);
						if (countries[countries[id].allies[k]].name.toLowerCase() == content[1]) {
							countries[id].allies[countries[id].allies[k]] = countries[id].allies.splice(k, 1);
							msg.channel.send("You now have unallied " + content[1]);
							foundAlly = true;
						}
					} catch (err) {
						console.log(err);
					}
				}
				if (!foundAlly) {
					msg.channel.send("They dont exist!");
				}
			}

		}

		//###############################
		//#           !whois            # <-- make an alternate that uses a country name to get the username of the person
		//###############################

		if (content[0] == call + "whois") {
			if (msg.mentions.members.first()) {
				id = msg.mentions.members.first().id, c = countries[id];
				msg.channel.send(`${msg.mentions.members.first().toString()} is the country of '${c.name}'`);
			} else {
				msg.channel.send('Please actually mention someone...')
			}
		}

		//###############################
		//#         !whoisowner         # <-- make an alternate that uses a country name to get the username of the person
		//###############################

		if (content[0] == call + "whoisowner") {
			var toSend = "";
			if (content[1] != undefined) {
				Object.keys(countries).forEach(function (key) {

					if (countries[key].name.toLowerCase() == content[1]) {
						toSend += `The owner of ${countries[key].name} is ${countries[key].owner}.`
					}

				});
				if (toSend != "") {
					msg.channel.send(toSend);
				} else {
					msg.channel.send("That country doesn't exist...")
				}
			} else {
				msg.channel.send('Please actually mention a country name...')
			}
		}

		//###############################
		//#       Admin Commands        #
		//###############################

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

client.on('ready', () => {
	setTimeout(() => tick(true), 1000);
})

//###############################
//#        Country Class        #
//###############################

class country {
	constructor(id, name, chosenEconomy = "capitalist", chosenGov = "dictatorship") {
		this.id = id;
		this.name = name;
		this.owner = client.users.get(id).tag
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
		this.capital = new location(Math.round(Math.random() * width), Math.round(Math.random() * height));
		//this.capital = new location(11, 15);
		console.log(this.capital.x, this.capital.y)
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

					}
				}
			}

			for (var x = this.capital.x - 1; x < this.capital.x + 2; x++) {
				for (var y = this.capital.y - 1; y < this.capital.y + 2; y++) {
					try {
						map[x][y].owner = id;
					} catch (err) {

					}
				}
			}

			map[this.capital.x][this.capital.y].owner = id;
			save(countries, map);
		}
	}
}
client.login(token)