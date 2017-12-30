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

module.exports = class RepowerCommand extends Commando.Command {
	constructor(client){
		super(client, {
			power: "economy",
			group: "options",
			memberpower: "economy",
			description: "Change your economy type. Check details for options.",
			details: oneline`Options: capitalist, communist, or meritist.
			Affects loyalty.
			Affects resource.
			Affects war ability.`,
			examples: ["!economy communist"],
			args: [
				{
					key: "economyChosen",
					prompt: "You gotta choose an economy!",
					type: "string"
				}
			]
		});
	}
	run(msg, {economyChosen}){
		id = msg.author.id;
		c = countries[id];
		if (economyChosen == "capitalist") {
			countries[id].economyType = "capitalist";
			save(countries, map);
			msg.channel.send("Economy set!");
		} else if (economyChosen == "communist") {
			countries[id].economyType = "communist";
			save(countries, map);
			msg.channel.send("Economy set!");
		} else if (economyChosen == "meritist") {
			countries[id].economyType = "meritist";
			save(countries, map);
			msg.channel.send("Economy set!");
		} else {
			msg.channel.send("Sorry, you can only be capitalist, communist, or meritist.");
		}
		
	}
};
