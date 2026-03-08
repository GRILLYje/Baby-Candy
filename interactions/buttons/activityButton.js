const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");

module.exports = async (interaction) => {

const modal = new ModalBuilder()
.setCustomId("activity_modal")
.setTitle("ส่งงาน : งัดร้าน");

const image = new TextInputBuilder()
.setCustomId("image")
.setLabel("ลิงก์รูปหลักฐาน")
.setStyle(TextInputStyle.Short)
.setRequired(true);

const note = new TextInputBuilder()
.setCustomId("note")
.setLabel("หมายเหตุ")
.setStyle(TextInputStyle.Paragraph)
.setRequired(false);

const row1 = new ActionRowBuilder().addComponents(image);
const row2 = new ActionRowBuilder().addComponents(note);

modal.addComponents(row1,row2);

await interaction.showModal(modal);

};