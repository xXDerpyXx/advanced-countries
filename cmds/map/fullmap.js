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

module.exports = class FullMapCommand extends Commando.Command {
	constructor(client){
		super(client, {
			name: "fullmap",
			group: "map",
			memberName: "fullmap",
			description: "Gives you the full map. :O",
			examples: ["!fullmap"],
		});
	}
	run(msg, args){
		id = msg.author.id;
		c = countries[id];
		save(countries, map);
		//msg.author.send('The Whole Map!',  {files: ["./map.txt"]});
		let buffer = makeImage(map, wars, 0, 0, width, height, countries, true);

		setTimeout(function () {
			msg.channel.send("Fullmap:", {
				files: [{
					attachment: buffer,
					name: "map.png",
				}],
			});
		}, 500);
		//console.log(getLocalMap(width/2,height/2,(width/2)+2,(height/2)+2,"sgkj;ljsfg"));
		
	}
};
