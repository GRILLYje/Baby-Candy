const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
    } = require("discord.js");
    
    module.exports = async (interaction)=>{
    
    const modal = new ModalBuilder()
    .setCustomId("leave_modal")
    .setTitle("📅 แจ้งลา");
    
    const start = new TextInputBuilder()
    .setCustomId("start")
    .setLabel("วันที่เริ่มลา (YYYY-MM-DD)")
    .setStyle(TextInputStyle.Short);
    
    const end = new TextInputBuilder()
    .setCustomId("end")
    .setLabel("วันที่กลับ (YYYY-MM-DD)")
    .setStyle(TextInputStyle.Short)
    .setRequired(false);
    
    const reason = new TextInputBuilder()
    .setCustomId("reason")
    .setLabel("เหตุผล")
    .setStyle(TextInputStyle.Paragraph);
    
    modal.addComponents(
    new ActionRowBuilder().addComponents(start),
    new ActionRowBuilder().addComponents(end),
    new ActionRowBuilder().addComponents(reason)
    );
    
    await interaction.showModal(modal);
    
    };