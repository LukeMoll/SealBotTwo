const Discord = require('discord.js');
const bot = new Discord.Client();

const fs = require('fs');
const yaml = require('js-yaml');

const commands = require('./commands.js');

let config;
try {
	config = yaml.safeLoad(fs.readFileSync('config.yaml', 'utf-8'));
}
catch (e) {
	console.error("Could not read config.yaml: " + e);
	process.exit(6);
}

commands.init(config.commands, config.options.prefix);

bot.on('ready', () => {
	console.log('[bot]\tI am ready!');
});

bot.on('disconnect', (closeEvent) => {
	console.log(`[bot]\tConnection closed: ${closeEvent.reason} (${closeEvent.code})`);
	process.exit(1);
});

bot.on('message', message => {
	commands.exec(message, bot);
});

bot.login(config.discord.token).catch((err) => {console.log(err);process.exit(2);});