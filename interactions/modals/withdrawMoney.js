module.exports = {
    id: "withdraw_money",
  
    async execute(interaction, client) {
      const amount = Number(interaction.fields.getTextInputValue("amount"));
      const note = interaction.fields.getTextInputValue("note") || "-";
  
      const data = client.pendingMoney.get(interaction.user.id);
      if (!data) {
        return interaction.reply({
          content: "❌ ไม่พบข้อมูลการถอนเงิน",
          ephemeral: true
        });
      }
  
      data.amount = amount;
      data.note = note;
      data.type = "withdraw";
  
      client.pendingMoney.set(interaction.user.id, data);
  
      await interaction.reply({
        content: "✅ กรุณาส่งรูปหลักฐานในแชทนี้ได้เลย",
        ephemeral: true
      });
    }
  };