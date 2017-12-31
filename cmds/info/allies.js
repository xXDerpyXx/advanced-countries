/*jshint esversion: 6 */
var vars = require("../../struct/vars.js");

module.exports = class AlliesCommand extends vars.Commando.Command {
	constructor(client){
		super(client, {
			name: "allies",
			group: "info",
			memberName: "allies",
			description: "List your or other's allies.",
			examples: ["!allies", "!allies @TheBestCountry'sOwner"],
			args: [
				{
					key: "useless",
					label: "mention",
					type: "string",
					default: "idkwhatyouwant",
					prompt: "asdf"
				}
			]
		});
	}
	run(msg, {useless}){
		id = msg.author.id;
		c = vars.countries[id];

		if (msg.mentions.members.first()) id = msg.mentions.members.first().id;

		temp = "";
		for (k in vars.countries[id].allies) {
			try {
				temp += "" + vars.countries[vars.countries[id].allies[k]].name + "\n";
			} catch (err) {
				console.log(k + " had an error, it's ID = " + vars.countries[id].allies[k]);
			}
		}
		msg.channel.send(temp);
	}
};



