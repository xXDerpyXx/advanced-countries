/*jshint esversion: 6 */
var {
	sqlite,
	path,
	oneline,
	Commando,
	fs,
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
	country,
	wars,
	guns
} = require("../../struct/vars.js");

module.exports = class WarCommand extends Commando.Command {
	constructor(client){
		super(client, {
			name: "war",
			group: "war",
			memberName: "war",
			description: "War people. Details for more info.",
			details: oneline`!war none will claim unowned land.
			!war all will war all non-allies.
			!war <all/none> west/east/north/south will war in that direction.
			Affects loyalty.
			Affects sway.
			Affects resource.
			Affects war ability.
			Affects population.`,
			examples: ["!war none", "!war none south"],
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
		c = countries[id];
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
			for (k in countries) {
				try {
					if (countries[k].name.toLowerCase() == subject) {
						target = k;
						msg.channel.send("Now at war with " + subject + dir);
						break;
					}
				} catch (err) {
					console.log(err.toString());
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
										console.log(err.toString);
									}
								}
							}
						}

						if (warable) {
							declareWar(x, y, id, target, false, wars, map, countries);
						}
					}
				}
			} else {
				if (subject == "all") {
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
											console.log(err.toString);
										}
									}
								}
							}

							if (warable) {
								declareWar(x, y, id, map[x][y].owner, false, wars, map, countries);
							}
						}
					}
					msg.channel.send("War declared on all non-allies" + dir + "!");
				} else if (subject == "none") {
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
											console.log(err.toString());
										}
									}
								}
							}

							if (warable) {
								declareWar(x, y, id, map[x][y].owner, false, wars, map, countries);
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
};
