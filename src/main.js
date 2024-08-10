const { Client, GatewayIntentBits, Events } = require('discord.js');
require('dotenv').config();
const loadCommands = require('./handlers/loadCommands');
const loadEvents = require ('./handlers/loadEvents');
const registerCommands = require('./handlers/registerCommands');
const OpenAI = require("openai");

const client = new Client({ 
   intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
	  GatewayIntentBits.GuildVoiceStates,
	] 
});
client.logger = new (require('./structures/Logger'))();
client.functions = require('./structures/Functions');
client.ai = new OpenAI({
	apiKey: process.env.API_KEY
})

const commands = loadCommands(client);
loadEvents(client);

client.login(process.env.TOKEN);

client.once(Events.ClientReady, (cient) => {
  registerCommands(client, commands)
});

process.on('unhandledRejection', (error) => {
	console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', (error) => {
	console.error('Unhandled promise rejection:', error);
});

process.on("exit", () => {
	if (client.interval)
		clearInterval(client.interval);
})
