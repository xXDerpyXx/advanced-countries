/*jshint esversion: 6 */
var vars = require("../../struct/vars.js");

module.exports = class ListCommand extends vars.Commando.Command {
	constructor(client){
		super(client, {
			name: "list",
			group: "info",
			memberName: "list",
			description: "Lists all countries.",
			examples: ["!list"],
		});
	}
	run(msg, args){
		id = msg.author.id;
		c = vars.countries[id];

		temp = "";
		for (k in vars.countries) {
			temp += vars.countries[k].name + "\n";
		}
		msg.channel.send("List of countries:\n" + temp);
	}
};




