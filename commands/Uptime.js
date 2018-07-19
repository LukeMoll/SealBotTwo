const Command = require('../commands.js').Command;

module.exports = class Uptime extends Command {

	/**
	 * @param {string} prefix: the prefix for this instance
	 */
	constructor(prefix) {
		let hooks = ["uptime"];
		super(prefix, hooks);
		this.name = "Uptime";
		this.hooks = hooks;
		this.help = {
			description: "How long this bot has been online for",
			usage: `${prefix}uptime`,
			text: "Replies with the time since this bot has been (re)started."
		};

		this.requiresLib = ["misc"];
	}

	/**
     * Run your command here.
     * @param {Message} message: the message that triggered this command
     * @param {Discord.Client} client: the client that this bot is running on
     * @param {Object} obj: Various scope passed between commands. Includes obj.db for databases
     */
    exec(message, client, obj) {
    	let text = "I have been online for **";
        let date = obj.lib.misc.secondsToPeriod(process.uptime());

        if(date.weeks > 0) {
          text += `${date.weeks} week${date.weeks > 1?"s":""}, `;
        }
        if(date.days > 0) {
          text += `${date.days} day${date.days > 1?"s":""}, `;
        }
        if(date.hours > 0) {
          text += `${date.hours} hour${date.hours > 1?"s":""}, `;
        }
        if(date.minutes > 0) {
          text += `${date.minutes} minute${date.minutes > 1?"s":""}, `;
        }

        text += `${date.seconds} second${date.seconds > 1?"s":""}**`;


        message.channel.send(text);
    }
	
}