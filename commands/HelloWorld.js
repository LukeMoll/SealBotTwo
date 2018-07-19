const Command = require('../commands.js').Command;

module.exports = class HelloWorld extends Command {

	/**
	 * @param {string} prefix: the prefix for this instance
	 */
	constructor(prefix) {
		let hooks = ["hello"];
		super(prefix, hooks);
		this.name = "HelloWorld";
		this.hooks = hooks;
		this.help = {
			description: "Responds \"Hello, world!\"",
			usage: `${prefix}hello`,
			text: "Replies with \"Hello, world!\". Doesn't get much simpler than that"
		};

	    this.requires = [];
	    this.requiresLib = [];
	    this.requiresDB = [];
	}

	/**
     * Run your command here.
     * @param {Message} message: the message that triggered this command
     * @param {Discord.Client} client: the client that this bot is running on
     * @param {Object} obj: Various scope passed between commands. Includes obj.db for databases
     */
    exec(message, client, obj) {
    	message.channel.send("Hello, world!");
    }
	
}