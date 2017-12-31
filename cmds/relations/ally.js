/*jshint esversion: 6 */
var vars = require("../../struct/vars.js");

module.exports = class AllyCommand extends vars.Commando.Command {
	constructor(client){
		super(client, {
			name: "ally",
			group: "relations",
			memberName: "ally",
			description: "Ally another country. Remember, it's one way!",
			details: oneline`Ally another country. One-way means that you won't war them, but they can war you until they ally you back.`,
			examples: ["!ally boi"],
			args: [
				{
					key: "alliance",
					label: "country",
					prompt: "Pick a country to ally!",
					type: "string"
				}
			]
		});
	}
	run(msg, {alliance}){
		id = msg.author.id;
		c = vars.countries[id];
		
		var foundAlly = false;
		for (k in vars.countries) {
			//console.log(vars.countries[k].name);
			if (vars.countries[k].name.toLowerCase() == alliance.toLowerCase()) {
				vars.countries[id].allies[vars.countries[id].allies.length] = vars.countries[k].id;
				msg.channel.send("You now have allied " + alliance);
				foundAlly = true;
			}
		}
		if (!foundAlly) {
			msg.channel.send("They dont exist!");
		}
	}
};



