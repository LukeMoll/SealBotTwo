const Command = require('../commands.js').Command;
const Discord = require('discord.js');

module.exports = class MemeAh extends Command {

	/**
	 * @param {string} prefix: the prefix for this instance
	 */
	constructor(prefix) {
		let hooks = ["ah"];
		super(prefix, hooks);
		this.name = "MemeAh";
		this.hooks = hooks;
		this.help = {
			description: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
			usage: `${prefix}aaa or ${prefix}AAAAAAAAAAHHHHHHHHHHH`,
			text: "Replies with screaming"
		};

		this.stubRegex = new RegExp(`^${prefix}a+h+`,'i');
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
			.setImage("https://cdn.discordapp.com/attachments/301036743174520832/349628298973937664/aaaaaaaaaaaaaaaah.png");

    	message.channel.send({embed});
		if(message.deletable) {
			message.delete().catch(err => console.log(`[${this.name}]\tError deleting message: ${err}`))
		}
		else {
			console.log(`[${this.name}]\tMessage not deletable, check permissions`);
		}
    }
	
}