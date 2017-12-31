/*jshint esversion: 6 */
var vars = require("../../struct/vars.js");

module.exports = class StatsCommand extends vars.Commando.Command {
	constructor(client){
		super(client, {
			name: "stats",
			group: "info",
			memberName: "stats",
			description: "Give your (or other's) statistics..",
			examples: ["!stats", "!stats @Affinix"],
			args: [
				{
					key: "mention",
					type: "string",
					default: "whatdoyawant",
					prompt: "asdf"
				}
			]
		});
	}
	run(msg, args){
		id = msg.author.id;
		c = vars.countries[id];

		if (msg.mentions.members.first()) id = msg.mentions.members.first().id, c = vars.countries[id];

		var temp = "";
		for (k in c) {
			temp += k + ": " + c[k] + "\n";
		}
		for (k in c.population) {
			temp += k + ": " + c.population[k] + "\n";
		}
		msg.channel.send(temp);
	}
};




