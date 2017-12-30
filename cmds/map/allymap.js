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

module.exports = class AllyMapCommand extends Commando.Command {
	constructor(client){
		super(client, {
			name: "allymap",
			group: "map",
			memberName: "allymap",
			description: "Gets the map of allies for you or others. Details for color key.",
			details: oneline`Red: No allies.
			Green: One-way alliance; either they allied you or you allied them, but both of you did not ally eachother.
			Blue: Full alliance.`,
			examples: ["!allymap", "!allymap DEV_boi"],
			args: [
				{
					key: "arg1",
					type: "string",
					default: "8090"
				}
			]
		});
	}
	run(msg, {arg1}){
		id = msg.author.id;
		c = countries[id];
		
		var theCountry;
		if (arg1 != "8090") {
			Object.keys(countries).forEach(function (key) {

				if (countries[key].name.toLowerCase() == arg1) {
					theCountry = countries[key];
				}

			});
		}
		save(countries, map);
		if (arg1 != "8090") {
			let buffer = makeImage(map, wars, 0, 0, width, height, countries, true, true, theCountry.id);

			setTimeout(function () {
				msg.channel.send(`Map of allies for ${theCountry.name}`, {
					files: [{
						attachment: buffer,
						name: "map.png",
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
						name: "map.png",
					}],
				});
			}, 500);
		}
	}
};
