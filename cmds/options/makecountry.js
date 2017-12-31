/*jshint esversion: 6 */
var vars = require("../../struct/vars.js");
var bot = require("../../bot.js");
module.exports = class MakeCountryCommand extends vars.Commando.Command {
	constructor(client){
		super(client, {
			name: "makecountry",
			group: "options",
			memberName: "makecountry",
			description: "Create a country if you haven't!",
			details: vars.oneline`Use this to make a country, because that's kinda a requirement to play this game.
			Economy Options: Communist, capitalist, meritist. Default is capitalist.
			Government Options: Republic, monarchy, facist, democracy, dictatorship. Default is dictatorship.`,
			examples: ["!makecountry TotallyTheBestCountry communist monarchy"],
			args: [
				{
					key: "name",
					prompt: "You gotta have a name...",
					type: "string"
				},
				{
					key: "economy",
					type: "string",
					default: "capitalist",
					prompt: "asdf"
				},
				{
					key:"government",
					type: "string",
					default: "dictatorship",
					prompt: "asdf"
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
				vars.countries[id] = new bot(id, name, economy, government);
				msg.channel.send("You've created the country of " + name);
				vars.save(vars.countries, vars.map);
			}

		}
	}
};
