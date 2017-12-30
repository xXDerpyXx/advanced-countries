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

module.exports = class PowerCommand extends Commando.Command {
	constructor(client){
		super(client, {
			power: "manpower",
			group: "options",
			memberpower: "manpower",
			description: "Change the percentage of your army that's enlisted.",
			details: oneline`_Very_ strategic.
			Useful to overpower your enemies or manage your resource cost.
			Changes resource cost.
			Changes war ability.`,
			examples: ["!manpower 100"],
			args: [
				{
					key: "power",
					prompt: "You gotta choose a percent!",
					type: "integer"
				}
			]
		});
	}
	run(msg, {power}){
		id = msg.author.id;
		c = countries[id];
		if (power <= 100) {
			if (power >= 0) {
				countries[id].population.manpower = parseFloat(power / 100);
				msg.channel.send("Manpower set to " + power + "%");
				save(countries, map);
			} else {
				msg.channel.send("Manpower too low!");
			}
		} else {
			msg.channel.send("Manpower too high!");
		}
		
	}
};
