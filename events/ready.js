const activityPanel = require("../panels/activityPanel");
const adminPanel = require("../panels/adminPanel");

module.exports = {
name: "clientReady",
once: true,

async execute(client){

console.log(`Logged in as ${client.user.tag}`);

/* ===== Activity Panel ===== */

const activityChannel = await client.channels.fetch("1480128485287526460");
const activityMessages = await activityChannel.messages.fetch({limit:10});

const activityExists = activityMessages.find(
m => m.author.id === client.user.id && m.components.length
);

if(!activityExists){
await activityPanel(client,"1480128485287526460");
console.log("Activity Panel Created");
}else{
console.log("Activity Panel Already Exists");
}

/* ===== Admin Panel ===== */

const adminChannel = await client.channels.fetch("1481006975574605996");
const adminMessages = await adminChannel.messages.fetch({limit:10});

const adminExists = adminMessages.find(
m => m.author.id === client.user.id && m.components.length
);

if(!adminExists){
await adminPanel(client,"1481006975574605996");
console.log("Admin Panel Created");
}else{
console.log("Admin Panel Already Exists");
}

}

};