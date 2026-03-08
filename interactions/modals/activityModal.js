const { EmbedBuilder } = require("discord.js");
const config = require("../../config/config");

module.exports = async (interaction)=>{

/* ดึงข้อมูลจาก cache */

const { type, members } = interaction.activityData;

/* รับค่าจาก modal */

const image = interaction.fields.getTextInputValue("image");

const note = interaction.fields.getTextInputValue("note") || "ไม่มี";

/* แปลงรายชื่อ */

const list = members.map(id=>`<@${id}>`).join("\n");

/* embed */

const embed = new EmbedBuilder()
.setColor("#2b2d31")
.setTitle(`📒 Activity Log : ${type}`)
.addFields(
{ name:"👤 ผู้บันทึก", value:`<@${interaction.user.id}>` },
{ name:"👥 สมาชิกที่เข้าร่วม", value:list },
{ name:"📝 หมายเหตุ", value:note }
)
.setImage(image)
.setTimestamp();

/* เลือกห้อง log */

let channelId;

if(type === "rob") channelId = config.channels.rob;
if(type === "house") channelId = config.channels.house;
if(type === "airdrop") channelId = config.channels.airdrop;

/* ส่ง log */

const channel = interaction.guild.channels.cache.get(channelId);

if(!channel){
return interaction.reply({
content:"❌ ไม่พบห้อง log",
ephemeral:true
});
}

await channel.send({embeds:[embed]});

/* ตอบผู้ใช้ */

await interaction.reply({
content:"✅ บันทึกกิจกรรมเรียบร้อย",
ephemeral:true
});

};