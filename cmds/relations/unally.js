/*jshint esversion: 6 */
var vars = require("../../struct/vars.js");

module.exports = class UnAllyCommand extends vars.Commando.Command {
	constructor(client){
		super(client, {
			name: "unally",
			group: "relations",
			memberName: "unally",
			description: "Unally another country. Remember, it's one way!",
			details: vars.oneline`Unally another country. One-way means that you won't war them, but they can war you until they ally you back.`,
			examples: ["!unally boi"],
			args: [
				{
					key: "alliance",
					label: "country",
					prompt: "Pick a country to unally!",
					type: "string"
				}
			]
		});
	}
	run(msg, {alliance}){
		id = msg.author.id;
		c = vars.countries[id];

		var foundAlly = false;
		for (k in vars.countries[id].allies) {
			try {
				//console.log(vars.countries[vars.countries[id].allies[k]].name+"|"+alliance+":"+vars.countries[id].allies[k]);
				if (vars.countries[vars.countries[id].allies[k]].name.toLowerCase() == alliance) {
					vars.countries[id].allies[vars.countries[id].allies[k]] = vars.countries[id].allies.splice(k, 1);
					msg.channel.send("You now have unallied " + alliance);
					foundAlly = true;
				}
			} catch (err) {
				console.log(err);
			}
		}
		if (!foundAlly) {
			msg.channel.send("They dont exist!");
		}
	}
};



