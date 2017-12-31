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

module.exports = class GiveResourceCommand extends Commando.Command {
	constructor(client){
		super(client, {
			name: "giveresource",
			group: "relations",
			memberName: "giveresource",
			description: "Gives another country a certain amount of resource.",
			details: oneline`Use this command to send resources, that's really all.`,
			examples: ["!giveresource xXxTheSuperAwesomeCountryxXx 1000"],
			args: [
				{
					key: "sendTo",
					label: "country",
					prompt: "You can't send to nobody!",
					type: "string"
				},
				{
					key: "numRes",
					label: "amount",
					type: "integer",
					prompt: "I'd recommend actually sending some resouces..."
				}
			]
		});
	}
	run(msg, {sendTo, numRes}){
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
			if (countries[id].resource >= numRes) {
				msg.channel.send("giving " + countries[c].name + " " + numRes + " resource!");
				countries[id].resource -= numRes;
				countries[c].resource += numRes;
			} else {
				msg.channel.send("you don't even have that much resource!");
			}
		} else {
			msg.channel.send("They don't exist!");
		}
	}
};



