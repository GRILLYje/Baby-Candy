const {
    ActionRowBuilder,
    StringSelectMenuBuilder,
    EmbedBuilder
    } = require("discord.js");
    
    module.exports = async (client, channelId)=>{
    
    const channel = await client.channels.fetch(channelId);
    
    /* ลบ panel เก่า */
    
    const messages = await channel.messages.fetch({ limit: 10 });
    
    messages.forEach(msg=>{
    if(msg.author.id === client.user.id && msg.components.length > 0){
    msg.delete().catch(()=>{});
    }
    });
    
    /* สร้าง panel ใหม่ */
    
    const embed = new EmbedBuilder()
    .setColor("#57F287")
    .setTitle("🦾 Gang Activity Panel")
    .setDescription(`
    ใช้สำหรับบันทึกกิจกรรมของสมาชิกแก๊ง ✨
    
    • เลือกประเภทกิจกรรม
    • เลือกสมาชิกที่เข้าร่วม
    • แนบหลักฐาน
    `);
    
    const select = new StringSelectMenuBuilder()
    .setCustomId("activity_type")
    .setPlaceholder("เลือกประเภทกิจกรรม")
    .addOptions([
    {
    label:"งัดร้าน",
    value:"rob",
    emoji:"💰",
    description:"กิจกรรมงัดร้าน"
    },
    {
    label:"งัดบ้าน",
    value:"house",
    emoji:"🏠",
    description:"กิจกรรมงัดบ้าน"
    },
    {
    label:"แอร์ดรอป",
    value:"airdrop",
    emoji:"📦",
    description:"กิจกรรมแอร์ดรอป"
    },
    {
    label:"สรุปกิจกรรม",
    value:"summary",
    emoji:"📊",
    description:"ดูสรุปกิจกรรมสมาชิก"
    }
    ]);
    
    const row = new ActionRowBuilder().addComponents(select);
    
    const msg = await channel.send({
    embeds:[embed],
    components:[row]
    });
    
    console.log("Panel Created:",msg.id);
    
    };