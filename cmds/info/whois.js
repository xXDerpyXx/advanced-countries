/*jshint esversion: 6 */
var vars = require("../../struct/vars.js");

module.exports = class WhoIsCommand extends vars.Commando.Command {
	constructor(client){
		super(client, {
			name: "whois",
			group: "info",
			memberName: "whois",
			description: "Mention a person to see what country they own.",
			examples: ["!whois @TbK"],
			args: [
				{
					key: "mention",
					label: "mention",
					type: "string",
					default: "idkwhatyouwant",
					prompt: "asdf"
				}
			]
		});
	}
	run(msg, {mention}){
		id = msg.author.id;
		c = vars.countries[id];
		
		if (msg.mentions.members.first()) {
			id = msg.mentions.members.first().id, c = vars.countries[id];
			msg.channel.send(`${msg.mentions.members.first().toString()} is the country of '${c.name}'`);
		} else {
			msg.channel.send("Please actually mention someone...");
		}
	}
};



