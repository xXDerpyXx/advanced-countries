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

module.exports = class AlliesCommand extends Commando.Command {
	constructor(client){
		super(client, {
			name: "allies",
			group: "info",
			memberName: "allies",
			description: "List your or other's allies.",
			examples: ["!allies", "!allies @TheBestCountry'sOwner"],
			args: [
				{
					key: "x",
					type: "integer",
					default: 8759
				},
				{
					key: "y",
					type: "integer",
					default: 8759
				},
				{
					key: "size",
					type: "integer",
					default: 9089
				}
			]
		});
	}
	run(msg, {x, y, size}){
		id = msg.author.id;
		c = countries[id];

		if (msg.mentions.members.first()) id = msg.mentions.members.first().id, c = countries[id];

		if (x == 8759 || y == 8759) {
			x = c.capital.x;
			y = c.capital.y;
		}
		if (size == 9089) {
			size = 10;
		}

		if (!(x==8759) && y == 8759)
			size = parseInt(content[1]);

		console.log(size);
		if (size <= 0) {
			msg.channel.send("Don't use negatives, silly...");
		} else {
			let buffer = makeImage(map, wars, x - size, y - size, x + size, y + size, countries);

			setTimeout(function () {
				msg.channel.send(`Center of ${x} ${y}`, {
					files: [{
						attachment: buffer,
						name: `${x}-${y}.png`,
					}],
				});
			}, 500);
		}
		//msg.channel.send("```markdown\n"+getLocalMap(x,y,11,11,c)+"```");
		//msg.channel.send("Center of ("+y+","+x+")");
	}
};



