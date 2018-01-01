/*jshint esversion: 6 */
var vars = require("../../struct/vars.js");
module.exports = class MakeFactionCommand extends vars.Commando.Command {
	constructor(client){
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
	run(msg, {name, economy, government}){
		id = msg.author.id;
		c = vars.countries[id];
		if(c.inFaction == undefined){
			c.inFaction = false;
		}
		if(!c.inFaction){
			vars.factions[id] = new vars.Faction(id, name);
			msg.channel.send(`${name} faction has been created!`);
		}else{
			msg.channel.send("You're already in a faction!");
		}
	}
};
