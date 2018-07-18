const Command = require('../commands.js').Command;

module.exports = class _ExampleCommand extends Command {

	/**
	 * @param {string} prefix: the prefix for this instance
	 */
	constructor(prefix) {
		let hooks = ["example", "eg"];
		super(prefix, hooks);
		this.name = "_ExampleCommand"; // File should be called _ExampleCommand.js
		this.hooks = hooks;
		this.help = {
			// What the command does
			description: "an example command, prints your text in uppercase",
			// How users invoke it. Will be printed on a stub (but not full) match.
			usage: `${prefix}example [--optional] yourTextHere`,
			// in-depth explanation of the command and any options. Will be printed on !help <name>
			text: "Replies with with your input in all uppercase letters. Use --optional to make this behaviour optional"
		};

		 // The names of other commands that this command depends upon
	    this.requires = [],
		    
	    // The names of libraries (found in lib/) that this command depends upon
	    this.requiresLib = [],
		
	    // the names of databases (found in data/ and put under obj.db) that this command uses
	    this.requiresDB = []

	    // and you can have your own init code here too
	    this.matchesRegex = new RegExp(`${this.stubRegex.source}( --optional)?(.+)`,'i');
	}

	/**
     * Checks if the input matches your command (fully). If not, commands.js will reply with `help.usage`. If this is not present then if your message starts with the prefix followed by a hook, your command matches.
     * @param {String} message: the message text
     * @return {Boolean}: true if this message does match fully and exec() should be called, false otherwise
     */
    matches(message) {
    	console.log("Matches()");
    	return this.matchesRegex.test(message)
    }

	/**
     * Run your command here.
     * @param {Message} message: the message that triggered this command
     * @param {Discord.Client} client: the client that this bot is running on
     * @param {Object} obj: Various scope passed between commands. Includes obj.db for databases
     */
    exec(message, client, obj) {
    	let match = this.matchesRegex.exec(message);
    	message.channel.send(match[2].toUpperCase());
    }
	
}