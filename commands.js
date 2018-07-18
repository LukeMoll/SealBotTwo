let nedb = require('nedb');

module.exports = {

    /**
     * 
     * @param {String[]} commands: command names to import
     * @param {String} prefix: command prefix
     */
    init: (commands, prefix) => {
        Promise.all(
            commands.map(c => new Promise( (resolve, reject) => {
                try {
                    resolve(require(`./commands/${c}.js`));
                }
                catch (e) {
                    reject(e);
                }
            }))
        ).then(importedClasses => {
            /**
             * @param importedClasses: array of Classes (functions) which extend Command.
             */

            // https://stackoverflow.com/a/26265095
            // Alright, a lot happens here. importedClasses gets reduced to a Map of command names to constructed command instances.
            let commands = importedClasses.reduce((map, cmd) => {map[cmd.name] = new cmd(prefix); return map}, {});
            let requireCmd = new Set();
            let requireLib = new Set();
            let requireDB = new Set();

            for (const i in commands) {
                commands[i].requires.forEach(r => requireCmd.add(r));
                commands[i].requiresLib.forEach(r => requireLib.add(r));
                commands[i].requiresDB.forEach(r => requireDB.add(r));
            }

            requireCmd = [...requireCmd].filter(c => !importedCommands.hasOwnProperty(c));
            let libs = {}, dbs = {};

            for (const cmd of requireCmd) {
                try {
                    commands[cmd] = require(`./commands/${cmd}.js`)
                } catch (e) {
                    console.error(`Could not import ./commands/${cmd}.js!`);
                    process.exit(5);
                }
            }

            for (const lib of requireLib) {
                try {
                    libs[cmd] = require(`./lib/${cmd}.js`)
                } catch (e) {
                    console.error(`Could not import ./lib/${cmd}.js!`);
                    process.exit(5);
                }
            }

            for (const db of requireDB) {
                try {
                    dbs[db] = new nedb({
                        filename: `./data/${db}.db`,
                        autoload: true
                    });
                } catch (e) {
                    console.error(`Could not create database ./data/${db}.db.`);
                    process.exit(6);
                }
            }

			this.obj = {
				db: dbs,
				lib: libs
			};
			this.commands = commands;
			for(const i in commands) {
				console.log(`[commands]\tloaded ${i} okay.`);
			}

        }).catch(err => {
        	console.error(`Error importing: ${err}`);
        	process.exit(5);
        })
    },

    exec: (message, client) => {
       	for(const i in this.commands) {
       		if(this.commands[i].run(message, client, this.obj)) {
       			break;
       		}
       	}
    },

    Command: class {

		/**
		 * @param {String} prefix: Command prefix for this instance
		 * @param {String[]} hooks: Hooks for this command, passed from subclass
		 */
		constructor(prefix, hooks) {
			this.prefix = prefix;
			this.requires = [];
			this.requiresLib = [];
			this.requiresDB = [];
			this.stubRegex = new RegExp(`^${prefix}(?:${hooks.join("|")})`, 'i');
		}

		test(message) {
			return this.stubRegex.test(message);
		}

		/**
		 * @param {Message} message: the message that (might) trigger this command
	     * @param {Discord.Client} client: the client that this bot is running on
	     * @param {Object} obj: Various scope passed between commands. Includes obj.db for databases
	     * @return {boolean}: whether this command matched
	     */
		run(message, client, obj) {
			if(this.test(message)) {
				if(!this.matches) {
					this.exec(message, client, obj);
				}
				else if(this.matches(message)) {
					this.exec(message, client, obj);;
				}
				else {
					message.channel.send("**Usage:** `" + this.help.usage + `\`\nFor more information type \`${this.prefix}help ${this.name}\``);
				}
				return true;
			}
			else {
				return false;
			}
		}
		
    }
}