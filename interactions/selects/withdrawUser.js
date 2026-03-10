const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
  id: "withdraw_user",

  async execute(interaction, client) {
    const userId = interaction.values[0];

    client.pendingMoney.set(interaction.user.id, {
        target: userId,
        amount: null,
        note: null,
        type: "withdraw"
      });

    const modal = new ModalBuilder()
      .setCustomId("withdraw_money")
      .setTitle("Withdraw Money");

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
  }
};