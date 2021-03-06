/*jshint esversion: 6 */
var vars = require("../../struct/vars.js");

module.exports = class RenameCommand extends vars.Commando.Command {
	constructor(client){
		super(client, {
			name: "rename",
			group: "options",
			memberName: "rename",
			description: "Rename yourself to something else.",
			details: vars.oneline`Renames your country.
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
		let reg = /^[a-z0-9]+$/i;
		id = msg.author.id;
		c = vars.countries[id];
		if(reg.test(name)){
			msg.channel.send("The country of " + vars.countries[id].name + " is now " + name);
			vars.countries[id].name = name;
			vars.save(vars.countries, vars.map);
		}else{
			msg.channel.send("Please, only letters or numbers.");
		}
	}
};
