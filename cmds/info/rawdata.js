/*jshint esversion: 6 */
var vars = require("../../struct/vars.js");

module.exports = class RawDataCommand extends vars.Commando.Command {
	constructor(client){
		super(client, {
			name: "rawdata",
			group: "info",
			memberName: "rawdata",
			description: "DM's you data.json and map.json. Perhaps useful in the future...?",
			examples: ["!rawdata"]
		});
	}
	run(msg, args){
		id = msg.author.id;
		c = vars.countries[id];

		save(vars.countries, vars.map);
		//msg.author.send('The Whole Map!',  {files: ["./map.txt"]});
		setTimeout(function () {
			msg.author.send("All the raw data:", {
				files: ["./data/data.json"],
			});
			msg.author.send({
				files: ["./data/map.json"],
			});
		}, 500);
	}
};



