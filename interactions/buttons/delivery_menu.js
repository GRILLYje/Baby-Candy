const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
    } = require("discord.js");
    
    module.exports = {
    
    id:"delivery_menu",
    
    async execute(interaction){
    
    const row = new ActionRowBuilder()
    .addComponents(
    
    new ButtonBuilder()
    .setCustomId("add_item")
    .setLabel("➕ เพิ่มของ")
    .setStyle(ButtonStyle.Success),
    
    new ButtonBuilder()
    .setCustomId("confirm_delivery")
    .setLabel("✅ ยืนยันส่งของ")
    .setStyle(ButtonStyle.Primary)
    
    );
    
    await interaction.reply({
    content:"📦 เมนูระบบส่งของ",
    components:[row],
    flags:64
    });
    
    }
    
    };