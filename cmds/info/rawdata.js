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

module.exports = class RawDataCommand extends Commando.Command {
	constructor(client){
		super(client, {
			name: "rawdata",
			group: "info",
			memberName: "rawdata",
			description: "DM's you data.json and map.json. Perhaps useful in the future...?",
			examples: ["!rawdata"]
		});
	}
	run(msg, args){
		id = msg.author.id;
		c = countries[id];

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
	}
};



