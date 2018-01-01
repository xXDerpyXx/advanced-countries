/*jshint esversion: 6 */
var vars = require("../../struct/vars.js");
module.exports = class MakeFactionCommand extends vars.Commando.Command {
	constructor(client){
		super(client, {
			name: "leavefaction",
			group: "options",
			memberName: "leavefaction",
			description: "Leave a faction...",
			details: vars.oneline`Leave a faction. Why would you though?`,
			examples: ["!leavefaction"],
		});
	}
	run(msg, {name}){
		id = msg.author.id;
		c = vars.countries[id];
		if(c.inFaction){
			oldFaction = vars.factions[c.faction].name;
			c.inFaction = false;
			c.faction = "none";
			found = true;
			msg.channel.send(`You've left the faction of ${oldFaction}!`);
			break;
		}else{
			msg.channel.send("You're not in a faction!");
		}
	}
};
