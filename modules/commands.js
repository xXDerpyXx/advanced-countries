const Command = require("../struct/Command.js");
const commands = require("../cmds/list.js");
const {
	token,
	call,
	width,
	height,
	tickSpeed,
	adminList
} = require("./config.js");

exports.doCommands = (msg) => {
	id = msg.author.id;
	content = msg.content.toLowerCase().split(" ");
	Object.keys(commands).forEach(function (key) {

		if (call + commands[key].call.toLowerCase() == content[0]) {
            var cmd = commands[key];
            const {command} = require(`../cmds/${commands[key].js}`);
		}

	});
};