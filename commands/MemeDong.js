const Command = require('../commands.js').Command;
const Discord = require('discord.js');

module.exports = class MemeDong extends Command {

	/**
	 * @param {string} prefix: the prefix for this instance
	 */
	constructor(prefix) {
		let hooks = ["dong","robodong"];
		super(prefix, hooks);
		this.name = "MemeDong";
		this.hooks = hooks;
		this.help = {
			description: "Sends a robodong",
			usage: `${prefix}dong`,
			text: "Sends a robodong"
		};
	}

	/**
     * Run your command here.
     * @param {Message} message: the message that triggered this command
     * @param {Discord.Client} client: the client that this bot is running on
     * @param {Object} obj: Various scope passed between commands. Includes obj.db for databases
     */
    exec(message, client, obj) {
    	const embed = new Discord.RichEmbed()
			.setColor(message.member.displayHexColor)
			.setAuthor(message.member.displayName, message.author.displayAvatarURL)
			.setImage("http://i.imgur.com/EXidTfD.gif");

    	message.channel.send({embed});
		if(message.deletable) {
			message.delete().catch(err => console.log(`[${this.name}]\tError deleting message: ${err}`))
		}
		else {
			console.log(`[${this.name}]\tMessage not deletable, check permissions`);
		}
    }
	
}