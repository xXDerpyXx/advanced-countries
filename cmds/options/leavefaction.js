/*jshint esversion: 6 */
var vars = require("../../struct/vars.js");
module.exports = class LeaveFactionCommand extends vars.Commando.Command {
	constructor(client) {
		super(client, {
			name: "leavefaction",
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
		if (c.inFaction && vars.factions[c.faction].owner != id) {
			vars.factions[c.faction].members.forEach((member, index, array) => {
				if (member == id) array.splice(index, 1);
			});
			oldFaction = vars.factions[c.faction].name;
			c.inFaction = false;
			c.faction = "none";
			msg.channel.send(`You've left the faction of ${oldFaction}!`);
			vars.save(vars.countries, vars.map);
		} else if (vars.factions[c.faction].owner == id) {
			msg.channel.send(
				"You're the owner of the faction! Delete it if you really want to leave!"
			);
		} else {
			msg.channel.send("You aren't in a faction!");
		}
	}
};
