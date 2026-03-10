const { 
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
    } = require("discord.js");
    
    module.exports = async (client, channelId) => {
    
    const channel = await client.channels.fetch(channelId);
    
    const embed = new EmbedBuilder()
    .setColor("#2f3136")
    .setTitle("🍇 Baby Grape Admin Panel")
    .setDescription("เลือกเมนูที่ต้องการใช้งาน");
    
    const row = new ActionRowBuilder().addComponents(
    
    new ButtonBuilder()
    .setCustomId("delivery_menu")
    .setLabel("📦 ระบบส่งของ")
    .setStyle(ButtonStyle.Primary),
    
    new ButtonBuilder()
    .setCustomId("money_menu")
    .setLabel("💰 ระบบเงิน")
    .setStyle(ButtonStyle.Success),
    
    new ButtonBuilder()
    .setCustomId("close_menu")
    .setLabel("❌ ปิดเมนู")
    .setStyle(ButtonStyle.Danger)
    
    );
    
    await channel.send({
    embeds:[embed],
    components:[row]
    });
    
    };