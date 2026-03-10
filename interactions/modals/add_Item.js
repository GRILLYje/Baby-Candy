const db = require("../../database/database");
const {
EmbedBuilder,
ActionRowBuilder,
ButtonBuilder,
ButtonStyle
} = require("discord.js");

module.exports = {

id:"add_item",

async execute(interaction){

const name = interaction.fields.getTextInputValue("name");
const amount = interaction.fields.getTextInputValue("amount");
const note = interaction.fields.getTextInputValue("note");

const result = db.prepare(`
INSERT INTO items (name,amount,note,status)
VALUES (?,?,?,"pending")
`).run(name,amount,note);

const embed = new EmbedBuilder()
.setTitle("📦 รายการของใหม่")
.setDescription(`ของ: ${name}\nจำนวน: ${amount}\nหมายเหตุ: ${note || "-"}`)
.addFields({
name:"สถานะ",
value:"⏳ รอส่ง"
})
.setTimestamp();

const row = new ActionRowBuilder()
.addComponents(

new ButtonBuilder()
.setCustomId(`confirm_delivery_${result.lastInsertRowid}`)
.setLabel("✅ ยืนยันส่งของ")
.setStyle(ButtonStyle.Success)

);

const channel = await interaction.client.channels.fetch(process.env.MONEY_LOG_CHANNEL);

await channel.send({
embeds:[embed],
components:[row]
});

await interaction.reply({
content:"✅ เพิ่มรายการของแล้ว",
flags:64
});

}
};