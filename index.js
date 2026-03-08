const { Client, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
const config = require("./config/config");

const createPanel = require("./panels/activityPanel");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds
  ]
});

client.commands = new Map();

/* โหลด commands */

fs.readdirSync("./commands").forEach(file => {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
});

/* โหลด events */

fs.readdirSync("./events").forEach(file => {
  const event = require(`./events/${file}`);
  client.on(event.name,(...args)=>event.execute(...args,client));
});

/* บอทออนไลน์ */

client.once("ready", async () => {

console.log(`Logged in as ${client.user.tag}`);

/* ส่ง Panel */

createPanel(client,"1480128485287526460");

});

client.login(config.token);