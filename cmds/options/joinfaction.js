/*jshint esversion: 6 */
var vars = require("../../struct/vars.js");
module.exports = class JoinFactionCommand extends vars.Commando.Command {
	constructor(client) {
		var vars = require("../../struct/vars.js");
		super(client, {
			name: "joinfaction",
			group: "options",
			memberName: "joinfaction",
			description: "Join a faction if you haven't!",
			details: vars.oneline`Join a faction. The owner of the faction can have all members war a country, and set their color.`,
			examples: ["!joinfaction TotallyTheBestFaction"],
			args: [
				{
					key: "name",
					prompt: "You gotta choose a faction to join...",
					type: "string"
				}
			]
		});
	}
	run(msg, { name }) {
		var vars = require("../../struct/vars.js");
		var id = msg.author.id;
		var c = vars.countries[id];
		var found = false;
		if (!c.inFaction) {
			Object.keys(vars.factions).forEach(key => {
				console.log("FACTION " + vars.factions[key].name); //open bot.js ples
				if (vars.factions[key].name.toLowerCase() == name.toLowerCase()) {
					vars.factions[key].members[vars.factions[key].members.length] = id;
					c.inFaction = true;
					c.faction = key; //
					c.color = vars.factions[key].color;
					found = true; //lets see
					msg.channel.send(`You've joined the faction of ${name}!`);
					vars.save(vars.countries, vars.map);
				}
			});
			if (!found) {
				msg.channel.send("That faction doesnt exist!");
			}
		} else {
			msg.channel.send("You're already in a faction!");
		}
	}
};
