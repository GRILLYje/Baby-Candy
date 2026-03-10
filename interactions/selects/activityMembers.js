module.exports = {
    id: "activity_members",
  
    async execute(interaction, client) {
      const data = client.pendingActivity.get(interaction.user.id);
  
      if (!data) {
        return interaction.reply({
          content: "❌ ไม่พบข้อมูลกิจกรรม",
          ephemeral: true
        });
      }
  
      data.members = interaction.values;
      client.pendingActivity.set(interaction.user.id, data);
  
      return interaction.reply({
        content: "📸 ส่งรูปหลักฐานในแชทนี้ได้เลย",
        ephemeral: true
      });
    }
  };