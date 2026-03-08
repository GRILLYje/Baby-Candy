const activityPanel = require("../panels/activityPanel");

module.exports = {
name: "clientReady",
once: true,

async execute(client){

console.log(`Logged in as ${client.user.tag}`);

await activityPanel(client,"1480128485287526460");

}

};