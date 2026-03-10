module.exports = {

    id:"deposit_money",
    
    async execute(interaction,client){
    
    let data = client.pendingMoney.get(interaction.user.id);
    if(!data) return;
    
    data.amount = Number(interaction.fields.getTextInputValue("amount"));
    data.note = interaction.fields.getTextInputValue("note") || "-";
    
    client.pendingMoney.set(interaction.user.id,data);
    
    console.log("PendingMoney updated:",data);
    
    await interaction.reply({
    content:"📸 ส่งรูปหลักฐานในแชทนี้",
    flags:64
    });
    
    }
    
    };