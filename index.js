const { Client, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
const config = require("./config/config");

const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent
    ]
  });

client.commands = new Map();
client.pendingActivity = new Map();
client.pendingMoney = new Map();

/* โหลด commands */

fs.readdirSync("./commands").forEach(file => {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
});

/* โหลด events */

fs.readdirSync("./events").forEach(file => {
  const event = require(`./events/${file}`);

  if(event.once){
    client.once(event.name,(...args)=>event.execute(...args,client));
  }else{
    client.on(event.name,(...args)=>event.execute(...args,client));
  }

});

client.login(config.token);
