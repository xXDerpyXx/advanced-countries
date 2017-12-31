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

module.exports = class AllyCommand extends Commando.Command {
	constructor(client){
		super(client, {
			name: "ally",
			group: "relations",
			memberName: "ally",
			description: "Ally another country. Remember, it's one way!",
			details: oneline`Ally another country. One-way means that you won't war them, but they can war you until they ally you back.`,
			examples: ["!ally boi"],
			args: [
				{
					key: "alliance",
					label: "country",
					prompt: "Pick a country to ally!",
					type: "string"
				}
			]
		});
	}
	run(msg, {alliance}){
		id = msg.author.id;
		c = countries[id];
		
		var foundAlly = false;
		for (k in countries) {
			//console.log(countries[k].name);
			if (countries[k].name.toLowerCase() == alliance.toLowerCase()) {
				countries[id].allies[countries[id].allies.length] = countries[k].id;
				msg.channel.send("You now have allied " + alliance);
				foundAlly = true;
			}
		}
		if (!foundAlly) {
			msg.channel.send("They dont exist!");
		}
	}
};



