const {
    ActionRowBuilder,
    UserSelectMenuBuilder,
    StringSelectMenuBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
    } = require("discord.js");
    
    const sendLog = require("../interactions/modals/activityModal");
    const summary = require("../interactions/selects/summary");
    
    const memberCache = new Map();
    
    module.exports = {
    name: "interactionCreate",
    
    async execute(interaction, client){
    
    try{
    
    /* รับ Slash Command */
    
    if (interaction.isChatInputCommand()) {
    
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    
    await command.execute(interaction, client);
    return;
    
    }
    
    /* เลือกประเภทกิจกรรม */
    
    if(interaction.isStringSelectMenu()){
    
    if(interaction.customId === "activity_type"){
    
    const type = interaction.values[0];
    
    /* reset panel */
    
    const resetMenu = new StringSelectMenuBuilder()
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
    
    const resetRow = new ActionRowBuilder().addComponents(resetMenu);
    
    /* reset select menu */
    
    await interaction.update({
    components:[resetRow]
    });
    
    /* เปิดเลือกสมาชิก */
    
    let max = 5;
    if(type === "airdrop") max = 10;
    if(type === "summary") max = 10;
    
    const menu = new UserSelectMenuBuilder()
    .setCustomId(`members_${type}`)
    .setPlaceholder("เลือกสมาชิก")
    .setMinValues(1)
    .setMaxValues(max);
    
    const row = new ActionRowBuilder().addComponents(menu);
    
    await interaction.followUp({
    content:`เลือกสมาชิก (สูงสุด ${max})`,
    components:[row],
    ephemeral:true
    });
    
    return;
    
    }
    
    }
    
    /* เลือกสมาชิก */
    
    if (interaction.isUserSelectMenu()) {

        const type = interaction.customId.split("_")[1];
        
        if(type === "summary"){
        return summary(interaction);
        }
        
    
    const members = interaction.values;
    
    memberCache.set(interaction.user.id,{
    type:type,
    members:members
    });
    
    const modal = new ModalBuilder()
    .setCustomId(`modal_${type}`)
    .setTitle("ส่งหลักฐานกิจกรรม");
    
    const img = new TextInputBuilder()
    .setCustomId("image")
    .setLabel("ลิงก์รูปหลักฐาน")
    .setStyle(TextInputStyle.Short)
    .setRequired(true);
    
    const note = new TextInputBuilder()
    .setCustomId("note")
    .setLabel("หมายเหตุ (ไม่กรอกก็ได้)")
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(false);
    
    modal.addComponents(
    new ActionRowBuilder().addComponents(img),
    new ActionRowBuilder().addComponents(note)
    );
    
    await interaction.showModal(modal);
    
    return;
    
    }
    
    /* ส่ง modal */
    
    if(interaction.isModalSubmit()){
    
    const cache = memberCache.get(interaction.user.id);
    
    interaction.activityData = cache;
    
    await sendLog(interaction);
    
    memberCache.delete(interaction.user.id);
    
    return;
    
    }
    
    }catch(err){
    
    console.log("Interaction Error:",err);
    
    if(!interaction.replied){
    await interaction.reply({
    content:"เกิดข้อผิดพลาด",
    ephemeral:true
    });
    }
    
    }
    
    }
    
    };