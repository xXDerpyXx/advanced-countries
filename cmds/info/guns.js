/*jshint esversion: 6 */
var vars = require("../../struct/vars.js");

module.exports = class ListGunCommand extends vars.Commando.Command {
	constructor(client){
		super(client, {
			name: "guns",
			group: "info",
			memberName: "guns",
			description: "List guns.",
			details: vars.oneline`There's really not much else to say.`,
			examples: ["!guns"],
		});
	}
	run(msg, args){
		id = msg.author.id;
		c = vars.countries[id];

		var temp = "";
		temp += "List of avalible guns\n";
		temp += "=====================\n";

		for (k in vars.guns) {
			temp += "-------\n";
			temp += k + "\n";
			temp += "-------\n";
			temp += "Counters: " + vars.guns[k].counters + "\n";
			temp += "Costs: " + vars.guns[k].cost + " per 100 troops\n";
			temp += "General Strength: " + vars.guns[k].modifier + "\n";
			//temp+="-------\n"
		}
		temp += "=====================\n";
		msg.channel.send(temp);
	}
};
