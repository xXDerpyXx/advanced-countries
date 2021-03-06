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
const commitCount = require("git-commit-count");

//commitCount(); // number of process.cwd()
//commitCount('any/git/repo'); // number

const fs = require("fs");
client
	.setProvider(
		sqlite
			.open(path.join(__dirname, "settings.sqlite3"))
			.then(db => new Commando.SQLiteProvider(db))
	)
	.catch(console.error);
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

var vars = require("./struct/vars.js");

try {
	console.log("[LOADING DATA]");
	if (vars.map == undefined) {
		console.log("[FAILED TO LOAD, CREATING DATA]");

		vars.map = generateMapPerlin();
		vars.save(vars.countries, vars.map);
	}
} catch (err) {
	console.log("[FAILED TO LOAD, CREATING DATA]");

	vars.map = generateMapPerlin();
	vars.save(vars.countries, vars.map);
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
	console.log("   Today is a new day");
	//client.channels.find("id","386688984845123587").send("A day has passed!");
	report += "```========================\n";
	report +=
		"Daily news! (V" +
		commitCount("https://github.com/xXDerpyXx/advanced-countries") +
		")\n";
	report += "------------------------\n";

	warVictories = {};
	popGrowth = {};
	armorment = {};

	for (c in vars.countries) {
		vars.countries[c].ownedCells = vars.getOwnedCells(
			vars.countries[c],
			vars.map,
			vars.countries
		);
		popGrowth[c] = {};
		popGrowth[c]["start"] = vars.countries[c].population.size;
		armorment[c] = {};
		if (vars.countries[c].gun == undefined) {
			vars.countries[c].gun = vars.guns["m1"];
		}
		var cMilitaryPop = Math.round(
			vars.countries[c].population.size *
			vars.countries[c].population.manpower /
			100
		);
		var armedPercent = 1;
		/*if (countries.resource < countries[c].gun.cost * cMilitaryPop) {

		}*/
		armedPercent =
			vars.countries[c].resource / (cMilitaryPop * vars.countries[c].gun.cost);
		if (armedPercent > 1) {
			vars.armedPercent = 1;
		}

		vars.countries[c].resource -=
			Math.round(vars.countries[c].gun.cost * cMilitaryPop) * armedPercent;
		if (vars.countries[c].resource < 0) vars.countries[c].resource = 0;
		armorment[c]["percent"] = armedPercent;
		if (vars.countries[c].genocidePercent != undefined) {
			vars.countries[c].population.size =
				vars.countries[c].population.size -
				vars.countries[c].population.size * vars.countries[c].genocidePercent;
		}
	}

	for (x in vars.map) {
		for (y in vars.map[x]) {
			if (vars.countries[vars.map[x][y].owner] != undefined) {
				vars.countries[vars.map[x][y].owner].resource +=
					vars.map[x][y].resource;
				if (
					vars.countries[vars.map[x][y].owner].population.size >
					vars.countries[vars.map[x][y].owner].ownedCells * 1000
				) {
					vars.countries[vars.map[x][y].owner].population.size =
						vars.countries[vars.map[x][y].owner].ownedCells * 1000;
				}
			}
		}
	}

	for (c in vars.countries) {
		if (vars.countries[c].population.size < 1) {
			report += vars.countries[c].name + " HAS FALLEN!!! <@" + c + ">\n";
			//client.channels.find("id","386688984845123587").send(countries[c].name+" HAS FALLEN!!! <@"+c+">");
			//console.log(countries[c].name+" fell due to population concerns: "+countries[c].population.size);
			for (x in vars.map) {
				for (y in vars.map[x]) {
					if (vars.map[x][y].owner == c) {
						vars.map[x][y].owner = "none";
					}
				}
			}

			delete vars.countries[c];
		} else {
			vars.countries[c].population.size += Math.round(
				vars.countries[c].population.size * 0.01
			);
			if (
				vars.countries[c].population.size >
				vars.countries[c].ownedCells * 1000
			) {
				vars.countries[c].population.size = vars.countries[c].ownedCells * 1000;
			}
		}
	}

	var wcount = 0;
	for (w in vars.wars) wcount++;
	//report += "------------------------\n";
	console.log("there are " + wcount + " wars currently");

	for (w in vars.wars) {
		try {
			if (
				vars.map[vars.wars[w].x][vars.wars[w].y].elevation > 0 &&
				vars.map[vars.wars[w].x][vars.wars[w].y].elevation < 10 &&
				vars.countries[vars.wars[w].attacker].population.manpower * 10 >
				Math.random() * vars.map[vars.wars[w].x][vars.wars[w].y].elevation
			) {
				if (vars.map[vars.wars[w].x][vars.wars[w].y].owner == "none") {
					if (Math.random() < 0.8) {
						vars.map[vars.wars[w].x][vars.wars[w].y].owner =
							vars.wars[w].attacker;
					}
				} else {
					for (
						var x = parseInt(vars.wars[w].x) - 1; x < parseInt(vars.wars[w].x) + 2; x++
					) {
						for (
							var y = parseInt(vars.wars[w].y) - 1; y < parseInt(vars.wars[w].y) + 2; y++
						) {
							try {
								//lol
								if (vars.map[x][y].owner == vars.wars[w].attacker) {
									//one sec, brb

									var tForce =
										vars.countries[vars.map[x][y].owner].population.size *
										vars.countries[vars.map[x][y].owner].population.manpower /
										vars.countries[vars.map[x][y].owner].ownedCells *
										1.25 *
										(Math.random() * 2) *
										armorment[vars.wars[w].attacker].percent *
										vars.countries[vars.wars[w].attacker].gun.modifier;
									if (
										vars.countries[vars.wars[w].attacker].gun.counters.includes(
											vars.countries[vars.wars[w].defender].gun.name
										)
									) {
										tForce = tForce * 1.5;
									}
									wars[w].aForce += tForce;
								}

								if (vars.wars[w].defender != "none") {
									if (vars.map[x][y].owner == vars.wars[w].defender) {
										var tForce =
											vars.countries[vars.map[x][y].owner].population.size *
											vars.countries[vars.map[x][y].owner].population.manpower /
											vars.countries[vars.map[x][y].owner].ownedCells *
											(Math.random() * 2) *
											vars.armorment[vars.wars[w].defender].percent *
											vars.countries[vars.wars[w].defender].gun.modifier;
										if (
											vars.countries[
												vars.wars[w].defender
											].gun.counters.includes(
												vars.countries[vars.wars[w].attacker].gun.name
											)
										) {
											tForce = tForce * 1.5;
										}
										vars.wars[w].dForce += tForce;
									}
								}
							} catch (err) {
								console.log(err.toString());
							}
						}
					}
					//client.channels.find("id","386688984845123587").send("War, "+wars[w].aForce+" force vs "+wars[w].dForce+" force");
					if (
						vars.wars[w].aForce > vars.wars[w].dForce &&
						Math.random() < 0.8
					) {
						//client.channels.find("id","386688984845123587").send("War won by "+countries[wars[w].attacker].name+", won with "+wars[w].aForce+" force");
						if (warVictories[vars.wars[w].attacker] == undefined) {
							warVictories[vars.wars[w].attacker] = 1;
						} else {
							warVictories[wars[w].attacker] += 1;
						}

						vars.map[vars.wars[w].x][vars.wars[w].y].owner =
							vars.wars[w].attacker;
						if (vars.wars[w].defender != "none") {
							vars.countries[vars.wars[w].attacker].population.size -=
								vars.countries[vars.wars[w].attacker].population.size *
								vars.countries[vars.wars[w].attacker].population.manpower /
								vars.countries[vars.wars[w].attacker].ownedCells *
								1;
							vars.countries[vars.wars[w].defender].population.size -=
								vars.countries[vars.wars[w].defender].population.size *
								vars.countries[vars.wars[w].defender].population.manpower /
								vars.countries[vars.wars[w].defender].ownedCells *
								0.5;
						}

						if (vars.wars[w].defender != "none") {
							if (
								vars.wars[w].x ==
								vars.countries[vars.wars[w].defender].capital.x &&
								vars.wars[w].y ==
								vars.countries[vars.wars[w].defender].capital.y
							) {
								//client.channels.find("id","386688984845123587").send(countries[wars[w].defender].name+" HAS FALLEN!!! <@"+wars[w].defender+">");
								for (x in vars.map) {
									for (y in vars.map[x]) {
										if (vars.map[x][y].owner == vars.wars[w].defender) {
											vars.map[x][y].owner = "none";
										}
									}
								}
								report +=
									vars.countries[wars[w].defender].name +
									" HAS FALLEN!!! <@" +
									vars.wars[w].defender +
									">\n";

								delete vars.countries[wars[w].defender];

								if (vars.countries[v].name != undefined) {
									tempCount++;
									try {
										report +=
											vars.countries[v].name +
											" claimed " +
											vars.warVictories[v] +
											" cells of land\n";
									} catch (err) {
										console.log(err.toString());
									}
								}
								//console.log(countries[wars[w].defender].name+" fell due to loosing a war");
							}
						}
						var tempd = "none";
						if (vars.wars[w].defender != "none")
							tempd = vars.countries[vars.wars[w].defender].name;
						console.log(
							vars.countries[vars.wars[w].attacker].name +
							":" +
							vars.wars[w].aForce +
							" captured " +
							vars.wars[w].x +
							"," +
							vars.wars[w].y +
							" from " +
							tempd +
							":" +
							vars.wars[w].dForce
						);
					} else {
						//client.channels.find("id","386688984845123587").send("War lost by "+countries[wars[w].attacker].name+", lost to "+wars[w].dForce+" force");
						//console.log(countries[wars[w].defender].name+":"+wars[w].dForce+" defended "+wars[w].x+","+wars[w].y+" from "+countries[wars[w].attacker].name+":"+wars[w].aForce);
						if (vars.countries[vars.wars[w].defender] != undefined) {
							vars.countries[vars.wars[w].attacker].population.size -=
								vars.countries[vars.wars[w].attacker].population.size *
								vars.countries[vars.wars[w].attacker].population.manpower /
								vars.countries[vars.wars[w].attacker].ownedCells *
								1;
							vars.countries[vars.wars[w].defender].population.size -=
								vars.countries[vars.wars[w].defender].population.size *
								vars.countries[vars.wars[w].defender].population.manpower /
								vars.countries[vars.wars[w].defender].ownedCells *
								0.5;
						}
					}
				}
			}
		} catch (err) {
			console.log(err.toString());
		}
		//countries[w.attacker].name);

		delete vars.wars[w];
	}

	var tempCount = 0;

	for (v in warVictories) {
		try {
			if (vars.countries[v].name != undefined) {
				tempCount++;

				try {
					report +=
						vars.countries[v].name +
						" claimed " +
						warVictories[v] +
						" cells of land\n";
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

	for (c in vars.countries) {
		vars.countries[c].ownedCells = vars.getOwnedCells(
			vars.countries[c],
			vars.map,
			vars.countries
		);
		f++;
		forceList[f] = {};
		forceList[f]["name"] = vars.countries[c].name;

		var cMilitaryPop = Math.round((vars.countries[c].population.size * vars.countries[c].population.manpower) / 100);
		var armedPercent = 1;
		armedPercent = vars.countries[c].resource / (cMilitaryPop * vars.countries[c].gun.cost);
		if (armedPercent > 1) {
			armedPercent = 1;
		}
		var cost = Math.round(vars.countries[c].gun.cost * cMilitaryPop) * armedPercent;

		forceList[f]["force"] =
			vars.countries[c].population.size *
			vars.countries[c].population.manpower /
			vars.countries[c].ownedCells *
			armedPercent;
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
		report +=
			forceList[f].name +
			": " +
			Math.round(forceList[f].force * 100) / 100 +
			"\n";
	}

	report += "------------------------\n";
	report += "   Population Growth\n";
	report += "------------------------\n";

	for (c in vars.countries) {
		prefix = "";

		if (vars.countries[c].population.size - popGrowth[c]["start"] > 0) {
			prefix = "+";
		}

		report +=
			vars.countries[c].name +
			": " +
			prefix +
			(vars.countries[c].population.size - popGrowth[c]["start"]) +
			"\n";
	}

	report += "========================```\n";

	client.guilds
		.first()
		.channels.find("name", "daily-news")
		.send(report);
	/*
	client.guilds
		.first()
		.channels.find("name", "general")
		.send("It is a new day!");*/
	vars.saveImage(vars.map, vars.wars, vars.countries);
	vars.save(vars.countries, vars.map);
	//no >:(
	if (repeat) {
		setTimeout(() => {
			tick(true);
		}, vars.tickSpeed);
	}
}

//###############################
//#        Message Event        #
//###############################
client.on("error", console.error);
client.on("warn", console.warn);
client.on("disconnect", () => {
	console.warn("Disconnected!");
});
client.on("reconnecting", () => {
	console.warn("Reconecting...");
});
client.on("commandError", (cmd, err) => {
	client.channels.find("name", "spam").send(err.toString()); //
	if (err instanceof Commando.FriendlyError) return; //hold up. cant we use like the dev console? and add a tab with irc?
	console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
});
client.on("commandBlocked", (msg, reason) => {
	console.log(oneLine `
		Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ""}
		blocked; ${reason}
	`);
});
client.on("commandPrefixChange", (guild, prefix) => {
	console.log(oneLine `
		Prefix ${prefix === "" ? "removed" : `changed to ${prefix || "the default"}`}
		${guild ? `in guild ${guild.name} (${guild.id})` : "globally"}.
	`);
});
client.on("commandStatusChange", (guild, command, enabled) => {
	console.log(oneLine `
		Command ${command.groupID}:${command.memberName}
		${enabled ? "enabled" : "disabled"}
		${guild ? `in guild ${guild.name} (${guild.id})` : "globally"}.
	`);
});
client.on("groupStatusChange", (guild, group, enabled) => {
	console.log(oneLine `
		Group ${group.id}
		${enabled ? "enabled" : "disabled"}
		${guild ? `in guild ${guild.name} (${guild.id})` : "globally"}.
	`);
});

client.on("message", msg => {
	try {
		id = msg.author.id;
		c = vars.countries[id];
		content = msg.content.toLowerCase().split(" ");
		if (vars.adminList.includes(msg.author.id)) {
			// == "246589957165023232" || msg.author.id == "338914218470539266" || msg.author.id == "185975071603556352"){
			if (content[0] == vars.call + "tick") {
				tick(false);
				msg.channel.send("tick forced!!! do not do this unless bugfixing!!!");
			}

			if (content[0] == vars.call + "destroy") {
				target = content[1];
				msg.channel.send(vars.countries[target].name + " got frickin' nuked");
				for (var x in map) {
					for (var y in map[x]) {
						if (vars.map[x][y].owner == target) {
							vars.map[x][y].owner = "none";
						}
					}
				}
				delete countries[target];
			}

			if (content[0] == vars.call + "forcerename") {
				vars.countries[content[1]].name = msg.content.split(" ")[2];
				msg.channel.send("you were renamed <@" + content[1] + ">");
			}

			if (content[0] == vars.call + "redoresource") {
				for(x in vars.map){
					for(y in vars.map[x]){
						vars.map[x][y].resource = Math.round(Math.random() * 100);
					}

				}
			}

			if (content[0] == vars.call + "setstat") {
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
					vars.countries[target][things[3].prop][things[4].prop] = parseFloat(
						vars.countries[target][things[3].prop][things[4].prop]
					);
					vars.countries[target][things[3].prop][things[4].prop] = parseFloat(
						value
					);
				} else {
					if (things[3] != undefined) {
						vars.countries[target][things[3].prop] = value;
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
	console.log(
		`Client ready; logged in as ${client.user.username}#${
			client.user.discriminator
		} (${client.user.id})`
	);
	setTimeout(() => tick(true), 1000);
});

var country = require("./struct/country.js");



//###############################
//#            Login            #
//###############################
client.login(vars.token);
