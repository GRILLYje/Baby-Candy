const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
  } = require("discord.js");
  
  module.exports = {
    id: "deposit_user",
  
    async execute(interaction, client) {
      console.log("[deposit_user] execute", {
        customId: interaction.customId,
        user: interaction.user.tag,
        replied: interaction.replied,
        deferred: interaction.deferred,
        values: interaction.values
      });
  
      if (interaction.replied || interaction.deferred) {
        console.log("[deposit_user] already acknowledged");
        return;
      }
  
      const userId = interaction.values[0];
  
      client.pendingMoney.set(interaction.user.id, {
        target: userId,
        amount: null,
        note: null,
        type: "deposit"
      });
  
      console.log("PendingMoney created:", client.pendingMoney.get(interaction.user.id));
  
      const modal = new ModalBuilder()
        .setCustomId("deposit_money")
        .setTitle("Deposit Money");
  
      const amount = new TextInputBuilder()
        .setCustomId("amount")
        .setLabel("จำนวนเงิน")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);
  
      const note = new TextInputBuilder()
        .setCustomId("note")
        .setLabel("หมายเหตุ")
        .setStyle(TextInputStyle.Short)
        .setRequired(false);
  
      modal.addComponents(
        new ActionRowBuilder().addComponents(amount),
        new ActionRowBuilder().addComponents(note)
      );
  
      await interaction.showModal(modal);
      console.log("[deposit_user] modal shown");
    }
  };