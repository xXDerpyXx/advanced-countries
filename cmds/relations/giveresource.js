/*jshint esversion: 6 */
var vars = require("../../struct/vars.js");

module.exports = class GiveResourceCommand extends vars.Commando.Command {
	constructor(client){
		super(client, {
			name: "giveresource",
			group: "relations",
			memberName: "giveresource",
			description: "Gives another country a certain amount of resource.",
			details: vars.oneline`Use this command to send resources, that's really all.`,
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
		c = vars.countries[id];
		var found = false;
		var c = "";
		for (k in vars.countries) {
			if (vars.countries[k].name.toLowerCase() == sendTo.toLowerCase()) {
				found = true;
				c = k;
			}
		}
		if (found) {
			if (vars.countries[id].resource >= numRes) {
				msg.channel.send("giving " + vars.countries[c].name + " " + numRes + " resource!");
				vars.countries[id].resource -= numRes;
				vars.countries[c].resource += numRes;
			} else {
				msg.channel.send("you don't even have that much resource!");
			}
		} else {
			msg.channel.send("They don't exist!");
		}
	}
};



