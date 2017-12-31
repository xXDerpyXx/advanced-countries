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

module.exports = class EconomyCommand extends Commando.Command {
	constructor(client){
		super(client, {
			name: "economy",
			group: "options",
			memberName: "economy",
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
