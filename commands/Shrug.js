const Command = require('../commands.js').Command;
const Discord = require('discord.js');
module.exports = class Shrug extends Command {

	/**
	 * @param {string} prefix: the prefix for this instance
	 */
	constructor(prefix) {
		let hooks = ["shrug"];
		super(prefix, hooks);
		this.name = "Shrug";
		this.hooks = hooks;
		this.help = {
			description: `¯\\_(ツ)_/¯ (For mobile users)`,
			usage: `${prefix}shrug`,
			text: "Replies with ¯\\_(ツ)_/¯"
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
			.setTitle(`¯\\_(ツ)_/¯`)
			.setColor(message.member.displayHexColor)
			.setAuthor(message.member.displayName, message.author.displayAvatarURL)
		message.channel.send({embed}).catch(error => {
			console.log(`[${this.name}] Embed send fail: ${error}`);
		});
		if(message.deletable) {
			message.delete().catch(error => {
				console.log(`[${this.name}] Delete message failed: ${error}`);
			})
		}
		else {
			console.log(`[${this.name}] Message not deletable - check permissions`);
		}
    }
	
}