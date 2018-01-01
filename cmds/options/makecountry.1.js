/*jshint esversion: 6 */
var vars = require("../../struct/vars.js");
module.exports = class MakeFactionCommand extends vars.Commando.Command {
	constructor(client){
		super(client, {
			name: "makefaction",
			group: "options",
			memberName: "makefaction",
			description: "Create a country if you haven't!",
			details: vars.oneline`Make a faction. The owner of the faction can have all members war a country, and set their color.`,
			examples: ["!makefaction TotallyTheBestFaction"],
			args: [
				{
					key: "name",
					prompt: "You gotta have a name...",
					type: "string"
				}
			]
		});
	}
	run(msg, {name, economy, government}){
		id = msg.author.id;
		c = vars.countries[id];

		//###############################
		//#        !makecountry         #
		//###############################

		if (c == undefined) {
			if (economy != "communist" && economy != "capitalist" && economy != "meritist" && economy != undefined) {
				msg.channel.send("That isn't an economy type! Types: capitalist, communist, or meritist. Say nothing for capitalist");
			} else if (government != "republic" && government != "monarchy" && government != "dictatorship" && government != "facist" && government != "democracy" && government != undefined) {
				msg.channel.send("That isn't a government type! Types: republic, dictatorship, monarchy, democracy, or facist. Say nothing for dictatorship");
			} else {
				vars.factions[id] = new 
				msg.channel.send("You've created the country of " + name);
				vars.save(vars.countries, vars.map);
			}

		}
	}
};
