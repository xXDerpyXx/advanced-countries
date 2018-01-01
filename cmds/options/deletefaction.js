/*jshint esversion: 6 */
var vars = require("../../struct/vars.js");
module.exports = class DelFactionCommand extends vars.Commando.Command {
	constructor(client) {
		super(client, {
			name: "deletefaction",
			group: "options",
			memberName: "leavefaction",
			description: "Leave a faction...",
			details: vars.oneline`Leave a faction. Why would you though?`,
			examples: ["!leavefaction"]
		});
	}
	run(msg, { name }) {
		var id = msg.author.id;
		var c = vars.countries[id];
		if (c.inFaction && vars.factions[c.faction].owner == id) {
			vars.factions[c.faction].members.forEach((member, index, array) => {
				vars.countries[member].inFaction = false;
				vars.countries[member].faction = "none";
			});
			oldFaction = vars.factions[c.faction].name;
			vars.factions.delete(c.faction);
			c.inFaction = false;
			c.faction = "none";
			msg.channel.send(`You've deleted the faction of ${oldFaction}!`);
			vars.save(vars.countries, vars.map);
		} else if (vars.factions[c.faction].owner != id) {
			msg.channel.send("You're not the owner of the faction!");
		} else {
			msg.channel.send("You aren't in a faction!");
		}
	}
};
