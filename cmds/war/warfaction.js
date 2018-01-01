/*jshint esversion: 6 */
var vars = require("../../struct/vars.js");

module.exports = class WarCommand extends vars.Commando.Command {
	constructor(client){
		super(client, {
			name: "warfaction",
			group: "war",
			memberName: "warfaction",
			description: "War people with your faction. Details for more info.",
			details: vars.oneline`!warfaction none will claim unowned land in your faciton.
			!war all will war all non-allies.
			!war <all/none> west/east/north/south will war in that direction.
			Affects loyalty.
			Affects sway.
			Affects resource.
			Affects war ability.
			Affects population.`,
			examples: ["!warfaction none", "!warfaction none south"],
			args: [
				{
					key: "subject",
					prompt: "You gotta war somewhere!",
					type: "string"
				},
				{
					key: "direction",
					type: "string",
					default: "9089",
					prompt: "asdf"
				}
			]
		});
	}
	run(msg, {subject, direction}){
		id = msg.author.id;
		c = vars.countries[id];
		if(c.inFaction && c.id == vars.factions[c.faction].owner){
			msg.channel.send("Having faction war...");

			
			vars.factions[c.faction].members.forEach((id) => {
				c = vars.countries[id];
				var dir = "";
				var right = 2;
				var left = 1;
				var up = 1;
				var down = 2;
				if (msg.content.includes("north") || msg.content.includes("east") || msg.content.includes("south") || msg.content.includes("west") || msg.content.includes("weast")) /*weast?*/ {
					up = 0;
					down = 1;
					left = 0;
					right = 1;
					if (msg.content.includes("east")) {
						up = 1;
						dir += " east";
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


				if (subject != undefined) {
					var target = "";
					for (k in vars.countries) {
						try {
							if (vars.countries[k].name.toLowerCase() == subject) {
								target = k;
								msg.channel.send("Now at war with " + subject + dir);
								break;
							}
						} catch (err) {
							console.log(err.toString());
						}
					}



					if (target != "") {

						for (var x in vars.map) {
							for (var y in vars.map[x]) {
								var warable = false;
								if (vars.map[x][y].owner == target) {
									for (var i = parseInt(x) - left; i < parseInt(x) + right; i++) {
										for (var j = parseInt(y) - up; j < parseInt(y) + down; j++) {
											try {
												if (vars.map[i][j].owner == id) {
													warable = true;
													break;
												}
											} catch (err) {
												console.log(err.toString);
											}
										}
									}
								}

								if (warable) {
									vars.declareWar(x, y, id, target, false, vars.wars, vars.map, vars.countries);
								}
							}
						}
					} else {
						if (subject == "all") {
							for (var x in vars.map) {
								for (var y in vars.map[x]) {
									var warable = false;
									if (vars.map[x][y].owner != id) {
										for (var i = parseInt(x) - left; i < parseInt(x) + (right); i++) {
											for (var j = parseInt(y) - up; j < parseInt(y) + (down); j++) {
												try {
													if (vars.map[i][j].owner == id) {
														warable = true;
														break;
													}
												} catch (err) {
													console.log(err.toString);
												}
											}
										}
									}

									if (warable) {
										vars.declareWar(x, y, id, vars.map[x][y].owner, false, vars.wars, vars.map, vars.countries);
									}
								}
							}
							msg.channel.send("War declared on all non-allies" + dir + "!");
						} else if (subject == "none") {
							for (var x in vars.map) {
								for (var y in vars.map[x]) {
									var warable = false;
									if (vars.map[x][y].owner == "none") {
										for (var i = parseInt(x) - left; i < parseInt(x) + (right); i++) {
											for (var j = parseInt(y) - up; j < parseInt(y) + (down); j++) {
												try {
													if (vars.map[i][j].owner == id) {
														warable = true;
														break;
													}
												} catch (err) {
													console.log(err.toString());
												}
											}
										}
									}

									if (warable) {
										vars.declareWar(x, y, id, vars.map[x][y].owner, false, vars.wars, vars.map, vars.countries);
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
			});
		}else{msg.channel.send("Either you arent faction owner are arent in a faction!");
		}
	}
};
