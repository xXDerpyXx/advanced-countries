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
	country,
	wars,
	guns
} = require("../../struct/vars.js");

module.exports = class DeleteCountryCommand extends Commando.Command {
	constructor(client){
		super(client, {
			name: "deletecountry",
			group: "options",
			memberName: "deletecountry",
			description: "Deletes your country. ***IRREVERSIBLE.***",
			details: oneline`Be ***VERY*** careful.`,
			examples: ["!deletecountry"],
		});
	}
	run(msg, args){
		id = msg.author.id;
		c = countries[id];
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
};
