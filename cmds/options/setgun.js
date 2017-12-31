/*jshint esversion: 6 */
var vars = require("../../struct/vars.js");

module.exports = class SetGunCommand extends vars.Commando.Command {
	constructor(client){
		super(client, {
			name: "setgun",
			group: "options",
			memberName: "setgun",
			description: "Set your gun, at the cost of 10% of your resource",
			details: oneline`Use this to set your gun. Be warned, however, as it uses 10% of your resource!
			Use it _wisely_.`,
			examples: ["!setgun m1"],
			args: [
				{
					key: "theGun",
					label: "gun",
					prompt: "Pick a gun! !guns to see them all.",
					type: "string"
				}
			]
		});
	}
	run(msg, {theGun}){
		id = msg.author.id;
		c = vars.countries[id];
		if (vars.guns[theGun] != undefined) {
			msg.channel.send("gun set!");
			vars.countries[id].gun = vars.guns[theGun];
			vars.countries[id].resource = vars.countries[id].resource - (vars.countries[id].resource * 0.1);
			save(vars.countries,map);
		} else {
			msg.channel.send(theGun + " is not a gun that exists");
		}
	}
};
