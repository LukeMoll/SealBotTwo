const Command = require('../commands.js').Command;
const Discord = require('discord.js');
const MojangAPI = require('mojang-api');

module.exports = class MinecraftSkin extends Command {

	/**
	 * @param {string} prefix: the prefix for this instance
	 */
	constructor(prefix) {
		let hooks = ["mcskin"];
		super(prefix, hooks);
		this.name = "MinecraftSkin"; // File should be called _ExampleCommand.js
		this.hooks = hooks;
		this.help = {
			// What the command does
			description: "Shows a users Minecraft skin",
			// How users invoke it. Will be printed on a stub (but not full) match.
			usage: `${prefix}mcskin @discorduser | minecraftuser`,
			// in-depth explanation of the command and any options. Will be printed on !help <name>
			text: "Either mention a user to see their linked account's skin or use their Minecraft name directly. See also: !linkaccount"
		};

	    this.requires = ["LinkAccount"];
	    this.requiresDB = ["connections"];

        // maybe this is a horrible way to construct RegExes but it's nice to use the literals        
	    this.matchesRegex = new RegExp(`${this.stubRegex.source}${/\s+(?:(?:<@!?(\d+)>)|([a-z0-9_]{3,16}))/.source}`,'i');
	}

	/**
     * Checks if the input matches your command (fully). If not, commands.js will reply with `help.usage`. If this is not present then if your message starts with the prefix followed by a hook, your command matches.
     * @param {String} message: the message text
     * @return {Boolean}: true if this message does match fully and exec() should be called, false otherwise
     */
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
        let match = this.matchesRegex.exec(message);
        if(match[1]) {
            // discord user
            let userID = match[1];
			obj.db.connections.find({_id: userID, mojang: {$exists: true}}, (err, docs) => {
				if(err) {
					const embed = new Discord.RichEmbed()
						.setColor("#ff0000")
						.setTitle("Database Error")
						.setDescription("```" + err + "```");
					message.channel.send({embed});
				}
				else if(docs.length > 0) {
					let embed = uuidToEmbed(docs[0].mojang.uuid, docs[0].mojang.username, false);
					message.channel.send({embed});
				}
				else {
					message.channel.send(`No linked Mojang account found for <@!${userID}>. See \`${this.prefix}help linkaccount\`.`);
				}
			})

        }
        else {
            // minecraft user
			let username = match[2];
			MojangAPI.nameToUuid(username, (err, res) => {
				if(err) {
					const embed = new Discord.RichEmbed() // TODO: put this in some generic library
                            .setColor("#ff0000")
                            .setTitle("Mojang API Error")
							.setDescription("```" + err + "```");
					message.channel.send({embed});
				}
				else if(res.length == 0) {
					message.channel.send(`No user called \`${username}\` found.`);
				}
				else {
					let embed = uuidToEmbed(res[0].id, res[0].name, false);
					message.channel.send({embed});
				}
			})
        }
    }
	
}

/**
 * 
 * @param {string} uuid Minecraft UUID
 */
function uuidToSkin(uuid, random) {
	let salt = random?`?uniq=${Math.random().toString().substr(2)}`:``;
	return {
		bodyUrlSmall: `https://visage.surgeplay.com/full/256/${uuid}.png${salt}`,
		bodyUrlLarge: `https://visage.surgeplay.com/full/2048/${uuid}.png${salt}`,
		headUrl: `https://crafatar.com/avatars/${uuid}.png${salt}`,
		text: `Skins provided by visage.surgeplay.com and crafatar.com`,
		textIcon: `https://visage.surgeplay.com/steve.png`
	}
}

function uuidToEmbed(uuid, minecraftuser, showUUID) {
	let skins = uuidToSkin(uuid);
	const embed = new Discord.RichEmbed()
		.setAuthor(minecraftuser, skins.headUrl)
		.setImage(skins.bodyUrlSmall)
		.setURL(skins.bodyUrlLarge)
		.setFooter(skins.text, skins.textIcon)
		.addBlankField(true)
		// add face to thumbnail?
	if(showUUID) {
		embed.addField("UUID", '`' + uuid + '`')
	}
	return embed;
}