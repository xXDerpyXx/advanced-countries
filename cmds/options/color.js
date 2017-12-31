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

module.exports = class ColorCommand extends Commando.Command {
	constructor(client){
		super(client, {
			name: "color",
			group: "options",
			memberName: "color",
			description: "Sets your map color.",
			details: oneline`Nothing else.`,
			examples: ["!color 10 150 255"],
			args: [
				{
					key: "r",
					prompt: "You need to have a color...",
					type: "integer"
				},
				{
					key: "g",
					prompt: "You need to have a color...",
					type: "integer"
				},
				{
					key: "b",
					prompt: "You need to have a color...",
					type: "integer"
				}
			]
		});
	}
	run(msg, {r,g,b}){
		id = msg.author.id;
		c = countries[id];
		if (r < 0 || g < 0 || b < 0) {
			msg.channel.send("R, G and B needs to be 0 or more!");
		} else if (r == null || g == null || b == null || r.isNaN() || g.isNaN() || b.isNaN()) {
			msg.channel.send("No nulls please!");
		} else {
			if (r > 255 || g > 255 || b > 255) {
				msg.channel.send("R, G and B needs to be less than 256!");
			} else {
				msg.channel.send("Map color set!");
				countries[id].color = {};
				countries[id].color.r = r;
				countries[id].color.g = g;
				countries[id].color.b = b;

			}
		}
	}
};
