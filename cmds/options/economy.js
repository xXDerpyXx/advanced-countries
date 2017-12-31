/*jshint esversion: 6 */
var vars = require("../../struct/vars.js");

module.exports = class EconomyCommand extends vars.Commando.Command {
	constructor(client){
		super(client, {
			name: "economy",
			group: "options",
			memberName: "economy",
			description: "Change your economy type. Check details for options.",
			details: oneline`Options: capitalist, communist, or meritist.
			Affects loyalty.
			Affects resource.
			Affects war ability.`,
			examples: ["!economy communist"],
			args: [
				{
					key: "economyChosen",
					prompt: "You gotta choose an economy!",
					type: "string"
				}
			]
		});
	}
	run(msg, {economyChosen}){
		id = msg.author.id;
		c = vars.countries[id];
		if (economyChosen == "capitalist") {
			vars.countries[id].economyType = "capitalist";
			vars.save(vars.countries, vars.map);
			msg.channel.send("Economy set!");
		} else if (economyChosen == "communist") {
			vars.countries[id].economyType = "communist";
			vars.save(vars.countries, vars.map);
			msg.channel.send("Economy set!");
		} else if (economyChosen == "meritist") {
			vars.countries[id].economyType = "meritist";
			vars.save(vars.countries, vars.map);
			msg.channel.send("Economy set!");
		} else {
			msg.channel.send("Sorry, you can only be capitalist, communist, or meritist.");
		}
		
	}
};
