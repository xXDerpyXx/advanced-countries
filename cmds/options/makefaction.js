/*jshint esversion: 6 */
var vars = require("../../struct/vars.js");
module.exports = class MakeFactionCommand extends vars.Commando.Command {
	constructor(client) {
		super(client, {
			name: "makefaction",
			group: "options",
			memberName: "makefaction",
			description: "Create a faction if you haven't!",
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
	run(msg, { name, economy, government }) {
		var id = msg.author.id;
		console.log(id);
		console.log(vars.countries);
		var c = vars.countries[id];
		console.log(c);
		console.log(vars.factions);
		if (c.inFaction == undefined) {
			c.inFaction = false;
		}
		if (!c.inFaction) {
			vars.factions[id] = new vars.Faction(id, name);
			c.faction = vars.factions[id].id;
			c.inFaction = true;
			msg.channel.send(`${name} faction has been created!`);
			vars.save(vars.countries, vars.map);
		} else {
			msg.channel.send("You're already in a faction!  Go make one!");
		}
	}
};
