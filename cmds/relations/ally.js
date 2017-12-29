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

module.exports = class GivePeopleCommand extends Commando.Command {
	constructor(client){
		super(client, {
			name: "givepeople",
			group: "relations",
			memberName: "givepeople",
			description: "Gives another country a certain amount of people.",
			details: oneline`Use this command to send people, that's really all.`,
			examples: ["!givepeople TheOtherAwesomeCountry 1000"],
			args: [
				{
					key: "sendTo",
					label: "country",
					prompt: "You can't send to nobody!",
					type: "string"
				},
				{
					key: "numPpl",
					label: "amount",
					type: "integer",
					prompt: "I'd recommend actually sending people..."
				}
			]
		});
	}
	run(msg, {sendTo, numPpl}){
		id = msg.author.id;
		c = countries[id];
		var found = false;
		var c = "";
		for (k in countries) {
			if (countries[k].name.toLowerCase() == sendTo.toLowerCase()) {
				found = true;
				c = k;
			}
		}
		if (found) {
			if (countries[id].population.size >= numPpl) {
				msg.channel.send("giving " + countries[c].name + " " + numPpl + " people!");
				countries[id].population.size -= numPpl;
				countries[c].population.size += numPpl;
				save(countries, map);
			} else {
				msg.channel.send("you don't even have that many people!");
			}
		} else {
			msg.channel.send("They don't exist!");
		}
	}
};



