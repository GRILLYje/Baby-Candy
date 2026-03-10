const {
    ActionRowBuilder,
    StringSelectMenuBuilder,
    UserSelectMenuBuilder
    } = require("discord.js");
    
    module.exports = {
    
    id:"money_menu",
    
    async execute(interaction){
    
    const menu = new StringSelectMenuBuilder()
    .setCustomId("money_select")
    .setPlaceholder("เลือกเมนูเงิน")
    .addOptions([
    {
    label:"ฝากเงิน",
    value:"deposit",
    emoji:"💰"
    },
    {
    label:"ถอนเงิน",
    value:"withdraw",
    emoji:"💸"
    },
    {
    label:"ดูยอดคงเหลือ",
    value:"balance",
    emoji:"📊"
    }
    ]);
    
    const row = new ActionRowBuilder().addComponents(menu);
    
    await interaction.reply({
    content:"💰 เมนูระบบเงิน",
    components:[row],
    flags:64
    });
    
    }
    
    };