/*jshint esversion: 6 */
var vars = require("../../struct/vars.js");

module.exports = class PowerCommand extends vars.Commando.Command {
	constructor(client){
		super(client, {
			name: "manpower",
			group: "options",
			memberName: "manpower",
			description: "Change the percentage of your army that's enlisted.",
			details: vars.oneline`_Very_ strategic.
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
		c = vars.countries[id];
		if (power <= 100) {
			if (power >= 0) {
				vars.countries[id].population.manpower = parseFloat(power / 100);
				msg.channel.send("Manpower set to " + power + "%");
				vars.save(vars.countries, vars.map);
			} else {
				msg.channel.send("Manpower too low!");
			}
		} else {
			msg.channel.send("Manpower too high!");
		}
		
	}
};
