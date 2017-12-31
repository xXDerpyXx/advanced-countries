/*jshint esversion: 6 */
var vars = require("../../struct/vars.js");

module.exports = class MapCommand extends vars.Commando.Command {
	constructor(client){
		super(client, {
			name: "map",
			group: "map",
			memberName: "map",
			description: "Get a map of an area.",
			examples: ["!map", "!map 50 50", "!map @Derpy"],
			args: [
				{
					key: "x",
					type: "integer",
					default: 8759,
					prompt: "asdf"
				},
				{
					key: "y",
					type: "integer",
					default: 8759,
					prompt: "asdf"
				},
				{
					key: "size",
					type: "integer",
					default: 9089,
					prompt: "asdf"
				}
			]
		});
	}
	run(msg, {x, y, size}){
		id = msg.author.id;
		c = vars.countries[id];
		if (x!=8759 && y == 8759)
			size = x;
		if (msg.mentions.members.first()) id = msg.mentions.members.first().id, c = vars.countries[id];

		if (x == 8759 || y == 8759) {
			x = c.capital.x;
			y = c.capital.y;
		}
		if (size == 9089) {
			size = 10;
		}

		

		console.log(size);
		if (size <= 0) {
			msg.channel.send("Don't use negatives, silly...");
		} else {
			let buffer = vars.makeImage(vars.map, vars.wars, x - size, y - size, x + size, y + size, vars.countries);

			setTimeout(function () {
				msg.channel.send(`Center of ${x} ${y}`, {
					files: [{
						attachment: buffer,
						name: `${x}-${y}.png`,
					}],
				});
			}, 500);
		}
		//msg.channel.send("```markdown\n"+getLocalMap(x,y,11,11,c)+"```");
		//msg.channel.send("Center of ("+y+","+x+")");
	}
};



