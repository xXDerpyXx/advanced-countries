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

module.exports = class ListGunCommand extends Commando.Command {
	constructor(client){
		super(client, {
			name: "guns",
			group: "info",
			memberName: "guns",
			description: "List guns.",
			details: oneline`There's really not much else to say.`,
			examples: ["!guns"],
		});
	}
	run(msg, args){
		id = msg.author.id;
		c = countries[id];

		var temp = "";
		temp += "List of avalible guns\n";
		temp += "=====================\n";

		for (k in guns) {
			temp += "-------\n";
			temp += guns[k].name + "\n";
			temp += "-------\n";
			temp += "Counters: " + guns[k].counters + "\n";
			temp += "Costs: " + guns[k].cost + " per 100 troops\n";
			temp += "General Strength: " + guns[k].modifier + "\n";
			//temp+="-------\n"
		}
		temp += "=====================\n";
		msg.channel.send(temp);
	}
};
