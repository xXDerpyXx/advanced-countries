/*jshint esversion: 6 */
const {
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
	country
} = require("../../struct/vars.js");

module.exports = class ResourceCommand extends Commando.Command {
	constructor(client){
		super(client, {
			name: "resource",
			group: "info",
			memberName: "resource",
			description: "Get the stats of you or other's resource generation.",
			examples: ["!resource", "!resource @TbK"],
			args: [
				{
					key: "mention",
					label: "mention",
					type: "string",
					default: "idkwhatyouwant"
				}
			]
		});
	}
	run(msg, {mention}){
		id = msg.author.id;
		c = countries[id];

		var temp = "";
		if (msg.mentions.members.first()) id = msg.mentions.members.first().id;
		temp += (`${msg.mentions.members.first() ? msg.mentions.members.first().toString() + " has " : "You have "}` + countries[id].resource + " resource\n");
		var total = 0;
		for (x in map) {
			for (y in map[x]) {
				try {
					if (map[x][y].owner == id) {
						total += map[x][y].resource;
					}
				} catch (err) {
					console.log(err.toString());
				}
			}
		}

		if (countries[id].gun == undefined) {
			countries[id].gun = guns["M1"];
		}
		var cMilitaryPop = Math.round((countries[id].population.size * countries[id].population.manpower) / 100);
		var armedPercent = 1;
		/*if (countries.resource < countries[id].gun.cost * cMilitaryPop) {

				}*/
		armedPercent = countries[id].resource / (cMilitaryPop * countries[id].gun.cost);
		if (armedPercent > 1) {
			armedPercent = 1;
		}
		var cost = Math.round(countries[id].gun.cost * cMilitaryPop) * armedPercent;
		var profit = total - cost;
		temp += ("you mine " + Math.round(total) + " resource per turn\n");
		temp += ("and spend " + Math.round(cost) + " per turn on weapons\n");
		temp += ("leaving you with " + Math.round(profit) + " per turn\n");
		if (mention == "webint") {
			msg.channel.send(temp + msg.author.id + "WEBINT_RESOURCE");
		} else {
			msg.channel.send(temp);
		}
	}
};



