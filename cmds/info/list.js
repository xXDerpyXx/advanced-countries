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

module.exports = class ListCommand extends Commando.Command {
	constructor(client){
		super(client, {
			name: "list",
			group: "info",
			memberName: "list",
			description: "Lists all countries.",
			examples: ["!list"],
		});
	}
	run(msg, args){
		id = msg.author.id;
		c = countries[id];

		temp = "";
		for (k in countries) {
			temp += countries[k].name + "\n";
		}
		msg.channel.send("List of countries:\n" + temp);
	}
};




