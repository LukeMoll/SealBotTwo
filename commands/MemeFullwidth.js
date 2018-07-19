const Command = require('../commands.js').Command;

module.exports = class MemeFullwidth extends Command {

	/**
	 * @param {string} prefix: the prefix for this instance
	 */
	constructor(prefix) {
		let hooks = ["fullwidth","vaporwave"];
		super(prefix, hooks);
		this.name = "MemeFullwidth";
		this.hooks = hooks;
		this.help = {
			description: "ｆｕｌｌｗｉｄｔｈ ｔｅｘｔ ｇｅｎｅｒａｔｏｒ ｔｅｘｔ ｇｅｎｅｒａｔｏｒ",
			usage: `${prefix}fullwidth your text here`,
			text: "Replies with your text in ｆｕｌｌｗｉｄｔｈ characters"
		};

		this.matchesRegex = new RegExp(`${this.stubRegex.source}\\s+(.*)`, 'i');
	}

	matches(message) {
		return this.matchesRegex.test(message);
	}

	/**
     * Run your command here.
     * @param {Message} message: the message that triggered this command
     * @param {Discord.Client} client: the client that this bot is running on
     * @param {Object} obj: Various scope passed between commands. Includes obj.db for databases
     */
    exec(message, client, obj) {
		let match = this.matchesRegex.exec(message.content);

		let fullwidth = "";
		for (let i in match[1]) {
			let code = string.charCodeAt(i);
			if (code >= 33 && code <= 126) {
				fullwidth += String.fromCharCode(code + 0xFEE0)
			}
			else if (i > 0) {
				fullwidth += string.charAt(i);
			}
		}

		const embed = new Discord.RichEmbed()
			.setColor(message.member.displayHexColor)
			.setAuthor(message.member.displayName, message.author.displayAvatarURL)
			.setTitle(fullwidth);
		message.channel.send({embed});
		if(message.deletable) {
			message.delete().catch(err => console.log(`[${this.name}]\tError deleting message: ${err}`))
		}
		else {
			console.log(`[${this.name}]\tMessage not deletable, check permissions`);
		}
	}
	
}