/*jshint esversion: 6 */
var vars = require("../../struct/vars.js");

module.exports = class ColorCommand extends vars.Commando.Command {
	constructor(client){
		super(client, {
			name: "color",
			group: "options",
			memberName: "color",
			description: "Sets your map color.",
			details: vars.oneline`Nothing else.`,
			examples: ["!color 10 150 255"],
			args: [
				{
					key: "r",
					prompt: "You need to have a color...",
					type: "integer"
				},
				{
					key: "g",
					prompt: "You need to have a color...",
					type: "integer"
				},
				{
					key: "b",
					prompt: "You need to have a color...",
					type: "integer"
				}
			]
		});
	}
	run(msg, {r,g,b}){
		id = msg.author.id;
		c = vars.countries[id];
		if (r < 0 || g < 0 || b < 0) {
			msg.channel.send("R, G and B needs to be 0 or more!");
		} else if (r == null || g == null || b == null || isNaN(r) || isNaN(g) || isNaN(b)) {
			msg.channel.send("No nulls please!");
		} else {
			if (r > 255 || g > 255 || b > 255) {
				msg.channel.send("R, G and B needs to be less than 256!");
			} else {
				msg.channel.send("Map color set!");
				vars.countries[id].color = {};
				vars.countries[id].color.r = r;
				vars.countries[id].color.g = g;
				vars.countries[id].color.b = b;

			}
		}
	}
};
