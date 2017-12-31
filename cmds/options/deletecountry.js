/*jshint esversion: 6 */
var vars = require("../../struct/vars.js");

module.exports = class DeleteCountryCommand extends vars.Commando.Command {
	constructor(client){
		super(client, {
			name: "deletecountry",
			group: "options",
			memberName: "deletecountry",
			description: "Deletes your country. ***IRREVERSIBLE.***",
			details: vars.oneline`Be ***VERY*** careful.`,
			examples: ["!deletecountry"],
		});
	}
	run(msg, args){
		id = msg.author.id;
		c = vars.countries[id];
		for (var x in vars.map) {
			for (var y in vars.map[x]) {
				if (vars.map[x][y].owner == id) {
					vars.map[x][y].owner = "none";
				}
			}
		}
		delete vars.countries[id];
		msg.channel.send("Country disbanded!");
	}
};
