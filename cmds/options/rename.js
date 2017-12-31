/*jshint esversion: 6 */
var vars = require("../../struct/vars.js");

module.exports = class RenameCommand extends vars.Commando.Command {
	constructor(client){
		super(client, {
			name: "rename",
			group: "options",
			memberName: "rename",
			description: "Rename yourself to something else.",
			details: oneline`Renames your country.
			Not really useful, more just confuses your allies and enemies.`,
			examples: ["!rename hahaha"],
			args: [
				{
					key: "name",
					prompt: "You gotta have a name!",
					type: "string"
				}
			]
		});
	}
	run(msg, {name}){
		id = msg.author.id;
		c = vars.countries[id];
		msg.channel.send("The country of " + countries[id].name + " is now " + name);
		vars.countries[id].name = name;
		vars.save(vars.countries, vars.map);
	}
};
