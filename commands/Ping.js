const Command = require('../commands.js').Command;

module.exports = class Ping extends Command {

	/**
	 * @param {string} prefix: the prefix for this instance
	 */
	constructor(prefix) {
		let hooks = ["ping"];
		super(prefix, hooks);
		this.name = "Ping";
		this.hooks = hooks;
		this.help = {
			description: "Pings the bot and replies",
			usage: `${prefix}ping`,
			text: "Replies with \"pong!\""
		};
	}

	/**
     * Run your command here.
     * @param {Message} message: the message that triggered this command
     * @param {Discord.Client} client: the client that this bot is running on
     * @param {Object} obj: Various scope passed between commands. Includes obj.db for databases
     */
    exec(message, client, obj) {
    	message.channel.send("pong!");
    }
	
}