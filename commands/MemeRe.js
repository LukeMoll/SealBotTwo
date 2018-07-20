const Command = require('../commands.js').Command;
const Discord = require('discord.js');

module.exports = class MemeRe extends Command {

	/**
	 * @param {string} prefix: the prefix for this instance
	 */
	constructor(prefix) {
		let hooks = ["re"];
		super(prefix, hooks);
		this.name = "MemeRe";
		this.hooks = hooks;
		this.help = {
			description: "REEEEEEEEEEEEEEEEEEEEE",
			usage: `${prefix}reeeeee or ${prefix}REEEEEEEEEEE`,
			text: "REEEEEEEEEEEEEE"
		};

		this.stubRegex = new RegExp(`^${prefix}re+`,'i');

		let weightedImgs = [
			{ url: "http://i0.kym-cdn.com/entries/icons/original/000/017/830/b49.gif", weight: 50 },
			{ url: "http://i0.kym-cdn.com/photos/images/original/000/934/549/245.jpg", weight: 10 },
			{ url: "http://i0.kym-cdn.com/photos/images/original/000/934/550/6cf.png", weight: 10 },
			{ url: "https://img.fireden.net/tg/image/1458/54/1458542400677.jpg", weight: 10 },
			{ url: "http://i.imgur.com/VQSucsH.png", weight: 1 },
			{ url: "http://i0.kym-cdn.com/photos/images/facebook/000/925/934/325.jpg", weight: 10 },
			{ url: "https://i.warosu.org/data/lit/img/0067/66/1435804938444.jpg", weight: 10 },
			{ url: "http://i0.kym-cdn.com/entries/icons/original/000/021/950/Pink_guy.png", weight: 1 }
		];
		
		this.imgs = [];
		weightedImgs.forEach((val) => {
			for(var i=0; i<val.weight; i++) {
			  this.imgs.push(val)
			}
		});
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
			.setImage(this.imgs[~~(Math.random() * this.imgs.length)].url);

    	message.channel.send({embed});
		if(message.deletable) {
			message.delete().catch(err => console.log(`[${this.name}]\tError deleting message: ${err}`))
		}
		else {
			console.log(`[${this.name}]\tMessage not deletable, check permissions`);
		}
    }
	
}