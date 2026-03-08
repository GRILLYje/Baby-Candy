const { SlashCommandBuilder } = require("discord.js");
const createPanel = require("../panels/activityPanel");

module.exports = {

data: new SlashCommandBuilder()
.setName("panel")
.setDescription("สร้าง activity panel"),

async execute(interaction, client){

await interaction.reply({
content:"สร้าง Panel แล้ว",
ephemeral:true
});

createPanel(client, interaction.channel.id);

}

};