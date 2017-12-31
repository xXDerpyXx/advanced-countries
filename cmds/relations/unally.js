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

module.exports = class UnAllyCommand extends Commando.Command {
	constructor(client){
		super(client, {
			name: "unally",
			group: "relations",
			memberName: "unally",
			description: "Unally another country. Remember, it's one way!",
			details: oneline`Unally another country. One-way means that you won't war them, but they can war you until they ally you back.`,
			examples: ["!unally boi"],
			args: [
				{
					key: "alliance",
					label: "country",
					prompt: "Pick a country to unally!",
					type: "string"
				}
			]
		});
	}
	run(msg, {alliance}){
		id = msg.author.id;
		c = countries[id];

		var foundAlly = false;
		for (k in countries[id].allies) {
			try {
				//console.log(countries[countries[id].allies[k]].name+"|"+alliance+":"+countries[id].allies[k]);
				if (countries[countries[id].allies[k]].name.toLowerCase() == alliance) {
					countries[id].allies[countries[id].allies[k]] = countries[id].allies.splice(k, 1);
					msg.channel.send("You now have unallied " + alliance);
					foundAlly = true;
				}
			} catch (err) {
				console.log(err);
			}
		}
		if (!foundAlly) {
			msg.channel.send("They dont exist!");
		}
	}
};



