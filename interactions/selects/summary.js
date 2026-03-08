const { EmbedBuilder } = require("discord.js");
const config = require("../../config/config");

module.exports = async (interaction) => {

await interaction.deferReply({ ephemeral: true });

const members = interaction.values;

/* ดึง channel */

const robChannel = await interaction.client.channels.fetch(config.channels.rob).catch(()=>null);
const houseChannel = await interaction.client.channels.fetch(config.channels.house).catch(()=>null);
const airChannel = await interaction.client.channels.fetch(config.channels.airdrop).catch(()=>null);

if(!robChannel || !houseChannel || !airChannel){
return interaction.editReply({
content:"❌ ไม่พบห้อง log กรุณาเช็ค config.channels"
});
}

/* ดึงข้อความ */

const robMsgs = await robChannel.messages.fetch({ limit: 100 });
const houseMsgs = await houseChannel.messages.fetch({ limit: 100 });
const airMsgs = await airChannel.messages.fetch({ limit: 100 });

let result = "";

/* ฟังก์ชันนับ */

const countUser = (messages, userId) => {

let count = 0;

messages.forEach(msg => {

if(msg.embeds.length){

const embed = msg.embeds[0];

if(embed.fields){

for(const field of embed.fields){

if(field.value && field.value.includes(`<@${userId}>`)){
count++;
break;
}

}

}

}

/* เผื่อบาง log ใช้ content */

if(msg.content && msg.content.includes(userId)){
count++;
}

});

return count;

};

/* คำนวณ */

for(const userId of members){

let rob = countUser(robMsgs, userId);
let house = countUser(houseMsgs, userId);
let air = countUser(airMsgs, userId);

result += `<@${userId}>
💰 งัดร้าน: ${rob}
🏠 งัดบ้าน: ${house}
📦 แอร์ดรอป: ${air}

`;

}

/* embed */

const embed = new EmbedBuilder()
.setColor("#5865F2")
.setTitle("📊 สรุปกิจกรรมสมาชิก")
.setDescription(result || "ไม่พบข้อมูลกิจกรรม")
.addFields({
name:"⏰ เวลาสรุป",
value:`<t:${Math.floor(Date.now()/1000)}:F>`
})
.setTimestamp();

/* ส่ง log */

const logChannel = await interaction.client.channels.fetch(config.channels.summary).catch(()=>null);

if(!logChannel){

console.log("❌ หา summary-log ไม่เจอ");

return interaction.editReply({
content:"❌ ไม่เจอห้อง summary-log กรุณาเช็ค config.channels.summary"
});

}

await logChannel.send({ embeds:[embed] });

await interaction.editReply({
content:"✅ ส่งสรุปกิจกรรมไปที่ห้อง summary-log แล้ว"
});

};