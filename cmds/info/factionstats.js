/*jshint esversion: 6 */
var vars = require("../../struct/vars.js");

module.exports = class FactionStatsCommand extends vars.Commando.Command {
	constructor(client) {
		super(client, {
			name: "factionstats",
			group: "info",
			memberName: "factionstats",
			description: "The stats of your faction",
			examples: ["!factionstats"]
		});
	}
	run(msg, args) {
		var id = msg.author.id;
		var c = vars.countries[id];
		var temp = "";
		var theFaction = vars.factions[c.faction];
		for (k in theFaction) {
			temp += k + ": " + theFaction[k] + "\n";
		}
		msg.channel.send(temp);
	}
};
