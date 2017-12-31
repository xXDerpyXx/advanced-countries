/*jshint esversion: 6 */
var vars = require("../../struct/vars.js");

module.exports = class WhoIsOwnerCommand extends vars.Commando.Command {
	constructor(client){
		super(client, {
			name: "whoisowner",
			group: "info",
			memberName: "whoisowner",
			description: "Mention a country name to see who owns it.",
			examples: ["!whoisowner DEV_Skeylis"],
			args: [
				{
					key: "mention",
					label: "mention",
					type: "string",
					default: "notacountrylolpleasestop",
					prompt: "asdf"
				}
			]
		});
	}
	run(msg, {mention}){
		id = msg.author.id;
		c = vars.countries[id];
		
		var toSend = "";
		if (mention != undefined) {
			Object.keys(vars.countries).forEach(function (key) {

				if (vars.countries[key].name.toLowerCase() == mention) {
					toSend += `The owner of ${vars.countries[key].name} is ${vars.countries[key].owner}.`;
				}

			});
			if (toSend != "") {
				msg.channel.send(toSend);
			} else {
				msg.channel.send("That country doesn't exist...");
			}
		} else {
			msg.channel.send("Please actually mention a country name...");
		}
	}
};



