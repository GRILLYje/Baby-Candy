const { EmbedBuilder } = require("discord.js");
const config = require("../../config/config");

module.exports = async (interaction)=>{

const members = interaction.values;

await interaction.deferReply({ephemeral:true});

const robChannel = await interaction.client.channels.fetch(config.channels.rob);
const houseChannel = await interaction.client.channels.fetch(config.channels.house);
const airChannel = await interaction.client.channels.fetch(config.channels.airdrop);

const robMsgs = await robChannel.messages.fetch({limit:100});
const houseMsgs = await houseChannel.messages.fetch({limit:100});
const airMsgs = await airChannel.messages.fetch({limit:100});

let result = "";

const countUser = (messages, userId) => {

    let count = 0;
    
    messages.forEach(msg => {
    
    if(!msg.embeds.length) return;
    
    const embed = msg.embeds[0];
    
    if(!embed.fields) return;
    
    for(const field of embed.fields){
    
    if(field.value.includes(`<@${userId}>`)){
    count++;
    break;
    }
    
    }
    
    });
    
    return count;
    
    };

    for(const userId of members){

        const rob = countUser(robMsgs, userId);
        const house = countUser(houseMsgs, userId);
        const air = countUser(airMsgs, userId);

robMsgs.forEach(m=>{
if(m.content.includes(userId)) rob++;
});

houseMsgs.forEach(m=>{
if(m.content.includes(userId)) house++;
});

airMsgs.forEach(m=>{
if(m.content.includes(userId)) air++;
});

result += `<@${userId}>
💰 งัดร้าน: ${rob}
🏠 งัดบ้าน: ${house}
📦 แอร์ดรอป: ${air}

`;
}

const embed = new EmbedBuilder()
.setColor("#5865F2")
.setTitle("📊 สรุปกิจกรรมสมาชิก")
.setDescription(result)
.addFields({
name:"⏰ เวลาสรุป",
value:`<t:${Math.floor(Date.now()/1000)}:F>`
})
.setTimestamp();

const logChannel = await interaction.client.channels.fetch(config.channels.summary).catch(()=>null);

if(!logChannel){
console.log("❌ หา summary-log ไม่เจอ");
return interaction.editReply({
content:"❌ ไม่เจอห้อง summary-log กรุณาเช็ค SUMMARY_LOG_CHANNEL ใน .env"
});
}

await logChannel.send({embeds:[embed]});

await interaction.editReply({
content:"✅ ส่งสรุปกิจกรรมไปที่ห้อง summary-log แล้ว"
});

};