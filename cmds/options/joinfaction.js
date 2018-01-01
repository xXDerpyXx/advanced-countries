/*jshint esversion: 6 */
var vars = require("../../struct/vars.js");
module.exports = class MakeFactionCommand extends vars.Commando.Command {
	constructor(client){
		super(client, {
			name: "joinfaction",
			group: "options",
			memberName: "joinfaction",
			description: "Join a faction if you haven't!",
			details: vars.oneline`Join a faction. The owner of the faction can have all members war a country, and set their color.`,
			examples: ["!makefaction TotallyTheBestFaction"],
			args: [
				{
					key: "name",
					prompt: "You gotta choose a faction to join...",
					type: "string"
				}
			]
		});
	}
	run(msg, {name}){
		id = msg.author.id;
		c = vars.countries[id];
		found = false
		if(!c.inFaction){
			Object.keys(vars.factions).forEach((key) => {
				if(vars.factions[key].name.toLowerCase() == name.toLowerCase()){
					vars.factions[key].members[vars.factions[key].members.length] = id;
					c.inFaction = true;
					c.faction = key;
					found = true;
					msg.channel.send(`You've joined the faction of ${name}!`);
					break;
				}
			});
			if(found){
				msg.channel.send("That faction doesnt exist!");
			}
		}else{
			msg.channel.send("You're already in a faction!");
		}
	}
};
