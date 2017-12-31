/*jshint esversion: 6 */
var vars = require("../../struct/vars.js");

module.exports = class FullMapCommand extends vars.Commando.Command {
	constructor(client){
		super(client, {
			name: "fullmap",
			group: "map",
			memberName: "fullmap",
			description: "Gives you the full map. :O",
			examples: ["!fullmap"],
		});
	}
	run(msg, args){
		id = msg.author.id;
		c = vars.countries[id];
		vars.save(vars.countries, vars.map);
		//msg.author.send('The Whole Map!',  {files: ["./map.txt"]});
		let buffer = vars.makeImage(vars.map, vars.wars, 0, 0, vars.width, vars.height, vars.countries, true);

		setTimeout(function () {
			msg.channel.send("Fullmap:", {
				files: [{
					attachment: buffer,
					name: "map.png",
				}],
			});
		}, 500);
		//console.log(getLocalMap(width/2,height/2,(width/2)+2,(height/2)+2,"sgkj;ljsfg"));
		
	}
};
