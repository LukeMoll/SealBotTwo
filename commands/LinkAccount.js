const Command = require('../commands.js').Command;
const MojangAPI = require('mojang-api');

module.exports = class LinkAccount extends Command {

	/**
	 * @param {string} prefix: the prefix for this instance
	 */
	constructor(prefix) {
		let hooks = ["linkaccount", "unlinkaccount"];
		super(prefix, hooks);
		this.name = "LinkAccount"; // File should be called _ExampleCommand.js
		this.hooks = hooks;
		this.help = {
			// What the command does
			description: "Link (or unlink) a gaming account to a Discord user",
			// How users invoke it. Will be printed on a stub (but not full) match.
			usage: `${prefix}linkaccount [@discorduser] mojang|blizzard <account>`,
			// in-depth explanation of the command and any options. Will be printed on !help <name>
			text: `Links to your Discord user by default. Specify a user to change this. To unlink an account use ${prefix}unlinkaccount [@user] mojang|blizzard. For Mojang accounts, use your Minecraft username. For Blizzard accounts, use your full Battle.net battletag (\`username#discriminator\`)`
		};

	    this.requiresLib = ["admin"];
	    this.requiresDB = ["connections"];

		this.matchesRegex = new RegExp(`${this.stubRegex.source}${/(?:\s+<@!?(\d+)>)?\s+(blizz?ard|mojang|battle\.net)(?:\s+([^\s]+))?\s*/.source}`,'i');
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
			obj.lib.admin.isAdmin(obj, message.guild, message.member).then(isAdmin => {
				if(isAdmin) {
					linkaccount(match[1], match[2], !message.content.startsWith(`${this.prefix}linkaccount`), match[3], obj, message);
				}
				else {
					message.channel.send(`You must be an admin in order to link other people's accounts!`);
				}
			})
		}
		else {
			linkaccount(message.member.id, match[2], !message.content.startsWith(`${this.prefix}linkaccount`), match[3], obj, message);
		}
    }
	
}

const blizzardRegex = /^(\w+)#(\d+)$/;

function linkaccount(userID, accountType, unlink, accountDetails, obj, message) {
	if(!unlink) {
		// Link operation
		if(/^(?:blizz?ard|battle\.net)$/.test(accountType)) {
			// blizzard
			if(blizzardRegex.test(accountDetails)) {
				let match = blizzardRegex.match(accountDetails);
				obj.db.connections.update({_id: userID}, {$set: {blizzard: {battletag: match[0], name: match[1], digits: match[2]}}}, {upsert:true}, 
					(err, count, docs, upsert) => {
						if(err) {
							const embed = new Discord.RichEmbed()
								.setColor("#ff0000")
								.setTitle("Database Error")
								.setDescription("```" + err + "```");
							message.channel.send({embed});
						}
						else {
							message.react(`✅`);
						}
				});
			}
			else {
				message.channel.send("Please give your full battletag (eg `Seagull#1894`)");
			}
		}
		else {
			// mojang
			if(/^[a-z0-9_]{3,16}$/i.test(accountDetails)) {
				MojangAPI.nameToUuid(accountDetails, (err0, res) => {
					if(err0) {
						const embed = new Discord.RichEmbed()
							.setColor("#ff0000")
							.setTitle("Mojang API Error")
							.setDescription("```" + err0 + "```");
						message.channel.send({embed});
					}
					else if(res.length == 0) {
						message.channel.send(`No user called \`${accountDetails}\` found.`);
					}
					else {
						obj.db.connections.update({_id: userID}, {$set: {mojang: {uuid: res[0].id, username: res[0].name}}}, {upsert: true},
							(err1,count,docs,upsert) => {
								if(err1) {
									const embed = new Discord.RichEmbed()
										.setColor("#ff0000")
										.setTitle("Database Error")
										.setDescription("```" + err1 + "```");
									message.channel.send({embed});
								}
								else {
									message.react(`✅`);
								}
						})
					}
				});
			}
		}
	}
	else {
		// unlink operation
		accountType = accountType.toLowerCase();
		accountType = /^(?:blizz?ard|battle\.net)$/.test(accountType)?'blizzard':accountType;
		// account type is now 'blizzard' | 'mojang'
		let update = {$unset: {}};
		update.$unset[accountType] = false;
		obj.db.connections.update({_id: userID}, update, {upsert: false}, (err, count, docs, upsert) => {
			if(err) {
				const embed = new Discord.RichEmbed()
					.setColor("#ff0000")
					.setTitle("Database Error")
					.setDescription("```" + err + "```");
				message.channel.send({embed});
			}
			else {
				message.react(`✅`);
			}
		});
	}
}
