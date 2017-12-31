/*jshint esversion: 6 */
var vars = require("../../struct/vars.js");

module.exports = class AllymapCommand extends vars.Commando.Command {
	constructor(client){
		super(client, {
			name: "allymap",
			group: "map",
			memberName: "allymap",
			description: "Gets the map of allies for you or others. Details for color key.",
			details: vars.oneline`Red: No allies.
			Green: One-way alliance; either they allied you or you allied them, but both of you did not ally eachother.
			Blue: Full alliance.`,
			examples: ["!allymap", "!allymap DEV_boi"],
			args: [
				{
					key: "arg1",
					type: "string",
					default: "8090",
					prompt: "asdf"
				}
			]
		});
	}
	run(msg, {arg1}){
		id = msg.author.id;
		c = vars.countries[id];
		
		var theCountry;
		var found = false;
		if (arg1 != "8090") {
			Object.keys(vars.countries).forEach(function (key) {

				if (vars.countries[key].name.toLowerCase() == arg1.toLowerCase()) {
					theCountry = vars.countries[key];
				}

			});
		}
		vars.save(vars.countries, vars.map);
		if (arg1 != "8090" && found) {
			let buffer = vars.makeImage(vars.map, vars.wars, 0, 0, vars.width, vars.height, vars.countries, true, true, theCountry.id);

			setTimeout(function () {
				msg.channel.send(`vars.map of allies for ${theCountry.name}`, {
					files: [{
						attachment: buffer,
						name: "vars.map.png",
					}],
				});
			}, 500);
		} else {
			//msg.author.send('The Whole vars.map!',  {files: ["./vars.map.txt"]});
			let buffer = vars.makeImage(vars.map, vars.wars, 0, 0, vars.width, vars.height, vars.countries, true, true, msg.author.id);

			setTimeout(function () {
				msg.channel.send(`Map of allies for ${vars.countries[msg.author.id].name}`, {
					files: [{
						attachment: buffer,
						name: "map.png",
					}],
				});
			}, 500);
		}
	}
};
