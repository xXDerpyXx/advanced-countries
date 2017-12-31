/*jshint esversion: 6 */
const {
	sqlite,
	path,
	oneline,
	Commando,
	fs,
	formatMass,
	save,
	recursiveWait,
	getOwnedCells,
	loadGuns,
	saveImage,
	token,
	call,
	width,
	height,
	tickSpeed,
	adminList,
	generateMap,
	getLocalMap,
	makeImage,
	declareWar,
	government,
	location,
	economy,
	cell,
	war,
	gun,
	countries,
	map,
	country,
	wars,
	guns
} = require("../../struct/vars.js");

module.exports = class RenameCommand extends Commando.Command {
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
		c = countries[id];
		if (name.charCodeAt(0) <= 255 && name.charAt(0) != "X" && name.charAt(0) != "*" && name.charAt(0) != "#" && !name.includes("@")) {
			msg.channel.send("The country of " + countries[id].name + " is now " + name);
			countries[id].name = name;
			save(countries, map);
		} else {
			msg.channel.send("You need a real name....");
		}
	}
};
