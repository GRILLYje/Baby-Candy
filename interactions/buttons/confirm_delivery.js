module.exports = {

    id:"confirm_delivery",
    
    async execute(interaction){
    
    await interaction.reply({
    content:"ระบบยืนยันส่งของกำลังพัฒนา",
    flags:64
    });
    
    }
    
    };