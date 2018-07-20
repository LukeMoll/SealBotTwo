const Command = require('../commands.js').Command;
const Discord = require('discord.js');

module.exports = class Admin extends Command {

	/**
	 * @param {string} prefix: the prefix for this instance
	 */
	constructor(prefix) {
		let hooks = ["admin", "admins"];
		super(prefix, hooks);
		this.name = "Admin"; // File should be called _ExampleCommand.js
		this.hooks = hooks;
		this.help = {
			// What the command does
			description: "Manages admins",
			// How users invoke it. Will be printed on a stub (but not full) match.
			usage: `${prefix}admin list | add/remove @user`,
			// in-depth explanation of the command and any options. Will be printed on !help <name>
			text: `List: shows all admins for this server.\nAdd/remove @user: sets @user as an admin for this server (mention them for it to work)`
		};

	    this.requiresLib = ["admin"];
	    this.requiresDB = ["admins"];

	    // and you can have your own init code here too
	    this.matchesRegex = new RegExp(`${this.stubRegex.source}\\s+(?:(list)|(add|remove)\\s+<@(\\d+)>\\s*)$`,'i');
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
    	if(match[1] && match[1].toLowerCase() === "list") {
            obj.lib.admin.getAdmins(obj, message.guild).then(admins => {
                const embed = new Discord.RichEmbed()
                    .setTitle(`Admins for ${message.guild.name}:`)
                    .setDescription(admins.map(gm => `**${gm.displayName}** (${gm.user.username}#${gm.user.discriminator})`).join("\n"))
                message.channel.send({embed});
            })
        }
        else {
            obj.lib.admin.isAdmin(obj, message.guild, message.member).then(isAdmin => {
                if(isAdmin) {
                    let value = match[2].toLowerCase() === "add";
                    let id = match[3];
                    obj.lib.admin.setAdmin(obj, message.guild, id, value).then(() => {
                        message.react(`✅`);
                    }).catch((err) => {
                        const embed = new Discord.RichEmbed()
                            .setColor("#ff0000")
                            .setTitle("An error occurred")
                            .setDescription("```" + err + "```");
                        message.channel.send({embed});
                    })
                }
                else {
                    message.channel.send(`You must be an admin in order to add other people as admins!\nSee the list of admins with \`${this.prefix}admin list\`.`);
                }
            })
        }
    }
	
}