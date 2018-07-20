const fs = require('fs');
const yaml = require('js-yaml');
const Discord = require('discord.js');

let config;
try {
	config = yaml.safeLoad(fs.readFileSync('config.yaml', 'utf-8'));
}
catch (e) {
    console.error("Could not read config.yaml: " + e);
    console.error("Have you written the config yet? If not, run:\n npm run init-config");
	process.exit(6);
}

const bot = new Discord.Client();

bot.login(config.discord.token).catch(console.err);
bot.on('ready', () => {
    console.log("To add this to a server, copy the following link into your browser:");
    console.log(`https://discordapp.com/oauth2/authorize?client_id=${bot.user.id}&scope=bot`);
    bot.destroy();
})