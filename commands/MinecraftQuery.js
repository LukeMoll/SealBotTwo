const Command = require('../commands.js').Command;
const Discord = require('discord.js');
const Gamedig = require('gamedig');

module.exports = class MinecraftQuery extends Command {

	/**
	 * @param {string} prefix: the prefix for this instance
	 */
	constructor(prefix) {
		let hooks = ["mcquery", "mc-query"];
		super(prefix, hooks);
		this.name = "MinecraftQuery";
		this.hooks = hooks;
		this.help = {
			// What the command does
			description: "Queries your configured Minecraft server",
			// How users invoke it. Will be printed on a stub (but not full) match.
			usage: `${prefix}mcquery [set address:port]`,
			// in-depth explanation of the command and any options. Will be printed on !help <name>
			text: `Gets the status of your Minecraft server. Use \`${prefix}mcquery set address:port\` to set which server is queried (\`:port\` should be the same port that you connect to, leave blank otherwise)`
		};

	    this.requires = ["Admin"];
	    this.requiresLib = ["admin"];
	    this.requiresDB = ["guilds"];

	    this.matchesRegex = new RegExp(`${this.stubRegex.source}\\s*(?:set ([^\\s:]+)(:\\d+)?)?$`,'i');
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
			// set operation
			obj.lib.admin.isAdmin(obj, message.guild, message.member).then(isAdmin => {
				if(isAdmin) {
					let host = match[1]
					let port = match[2]?match[2].substr(1) : 25565
					obj.db.guilds.update({_id: message.guild.id}, {$set: {"_minecraft.servers.default": {ip: host, port: port}}}, {upsert:true}, 
						(err, count, docs, upsert) => {
							if(err) {
								const embed = new Discord.RichEmbed() // TODO: put this in some generic library
									.setColor("#ff0000")
									.setTitle("An error occurred")
									.setDescription("```" + err + "```");
								message.channel.send({embed});
							}
							else {
								message.react(`✅`);
							}
						}
					)
				}
			})
		}
		else {
			// query operation
			obj.db.guilds.find({_id: message.guild.id}, (err, docs) => {
				if(err) {
					const embed = new Discord.RichEmbed() // TODO: put this in some generic library
                            .setColor("#ff0000")
                            .setTitle("An error occurred")
                            .setDescription("```" + err + "```");
					messsage.channel.send({embed});
				}
				else {
					if(docs.length > 0 && docs[0]._minecraft 
						&& docs[0]._minecraft.servers 
						&& docs[0]._minecraft.servers.default
						&& docs[0]._minecraft.servers.default.ip ) {
						let server = docs[0]._minecraft.servers.default;
						// go for query
						Gamedig.query({
							type: 'minecraft',
							host: server.ip,
							port: server.port
						}).then(state => {
							// message.channel.send('```json' + JSON.stringify(state,null,2) + '```');
							const embed = new Discord.RichEmbed({
								"title": "Server Online",
								"description": `_${state.name}_`,
								"fields": [
								  {
									"name": "IP",
									"value": `\`${server.ip}:${state.raw.hostport}\``,
									"inline": true
								  },
								  {
									"name": "Version",
									"value": `${state.raw.version}`,
									"inline": true
								  },
								  {
									"name": `Players (${state.raw.numplayers}/${state.raw.maxplayers})`,
									"value": state.players.map(o => `• ${o.name}`).join("\n")
								  }
								]
							  }).setColor("#00FF88");
							message.channel.send({embed});
						}).catch(error => {
							const embed = new Discord.RichEmbed() // TODO: put this in some generic library
								.setColor("#ffff00")
								.setTitle("An error occurred")
								.setDescription('```' + error + '```');
							message.channel.send({embed});
						})
					}
					else {
						const embed = new Discord.RichEmbed() // TODO: put this in some generic library
                            .setColor("#ffff00")
                            .setTitle("No Minecraft server configured for " + message.guild.name)
							.setDescription(`Please use \`${this.prefix}mcquery set address:port\` to fix this.`);
						message.channel.send({embed});
						console.log(JSON.stringify(docs[0],null,2));
						console.log(docs.length);
						}
				}
			})
		}
    }
	
}