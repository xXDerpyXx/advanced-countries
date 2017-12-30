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

module.exports = class MakeCountryCommand extends Commando.Command {
	constructor(client){
		super(client, {
			name: "makecountry",
			group: "options",
			memberName: "makecountry",
			description: "Create a country if you haven't!",
			details: oneline`Use this to make a country, because that's kinda a requirement to play this game.
			Economy Options: Communist, capitalist, meritist. Default is capitalist.
			Government Options: Republic, monarchy, facist, democracy, dictatorship. Default is dictatorship.`,
			examples: ["!makecountry TotallyTheBestCountry communist monarchy"],
			args: [
				{
					key: "name",
					prompt: "You gotta have a name...",
					type: "string"
				},
				{
					key: "economy",
					type: "string",
					default: "capitalist"
				},
				{
					key:"government",
					type: "string",
					default: "dictatorship"
				}
			]
		});
	}
	run(msg, {name, economy, government}){
		id = msg.author.id;
		c = countries[id];

		//###############################
		//#        !makecountry         #
		//###############################

		if (c == undefined) {
			if (name.charCodeAt(0) <= 255 && name.charAt(0) != "X" && name.charAt(0) != "*" && name.charAt(0) != "#" && !name.includes("@")) {
				msg.channel.send("We can't accept that name, sorry...");

			} else if (economy != "communist" && economy != "capitalist" && economy != "meritist" && economy != undefined) {
				msg.channel.send("That isn't an economy type! Types: capitalist, communist, or meritist. Say nothing for capitalist");
			} else if (government != "republic" && government != "monarchy" && government != "dictatorship" && government != "facist" && government != "democracy" && government != undefined) {
				msg.channel.send("That isn't a government type! Types: republic, dictatorship, monarchy, democracy, or facist. Say nothing for dictatorship");
			} else {
				countries[id] = new country(id, name, economy, government);
				msg.channel.send("You've created the country of " + name);
				save(countries, map);
			}

		}
	}
};