/*jshint esversion: 6 */
var vars = require("../../struct/vars.js");

module.exports = class GivePeopleCommand extends vars.Commando.Command {
	constructor(client) {
		super(client, {
			name: "givepeople",
			group: "relations",
			memberName: "givepeople",
			description: "Gives another country a certain amount of people.",
			details: vars.oneline `Use this command to send people, that's really all.`,
			examples: ["!givepeople TheOtherAwesomeCountry 1000"],
			args: [{
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
	run(msg, {
		sendTo,
		numPpl
	}) {
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
			if (numPpl <= 0) {
				msg.channel.send("You can't give negative people! That would be cheating!");
			} else if (vars.countries[id].population.size >= numPpl) {
				msg.channel.send("giving " + vars.countries[c].name + " " + numPpl + " people!");
				vars.countries[id].population.size -= numPpl;
				vars.countries[c].population.size += numPpl;
				vars.save(vars.countries, vars.map);
			} else {
				msg.channel.send("you don't even have that many people!");
			}
		} else {
			msg.channel.send("They don't exist!");
		}
	}
};