const { REST, Routes } = require('discord.js');
const fs = require('fs');
const config = require('./config/config');

const commands = [];

const commandFiles = fs.readdirSync('./commands');

for (const file of commandFiles) {
const command = require(`./commands/${file}`);
commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(config.token);

(async () => {
try {

console.log('Refreshing slash commands...');

await rest.put(
Routes.applicationCommands(config.clientId),
{ body: commands },
);

console.log('Slash commands loaded');

} catch (error) {
console.error(error);
}
})();