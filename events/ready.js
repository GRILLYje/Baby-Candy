const panel = require("../panels/activityPanel");
const config = require("../config/config");

module.exports = {
name: "clientReady",
once: true,

async execute(client){

console.log(`Logged in as ${client.user.tag}`);

}

};