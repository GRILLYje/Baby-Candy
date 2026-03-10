const {
    ActionRowBuilder,
    UserSelectMenuBuilder
  } = require("discord.js");
  
  module.exports = {
    id: "money_select",
  
    async execute(interaction) {
      const action = interaction.values[0];
  
      if (action === "deposit") {
        const menu = new UserSelectMenuBuilder()
          .setCustomId("deposit_user")
          .setPlaceholder("เลือกผู้ใช้ที่จะฝากเงิน");
  
        const row = new ActionRowBuilder().addComponents(menu);
  
        return interaction.reply({
          content: "💰 เลือกผู้ใช้",
          components: [row],
          ephemeral: true
        });
      }
  
      if (action === "withdraw") {
        const menu = new UserSelectMenuBuilder()
          .setCustomId("withdraw_user")
          .setPlaceholder("เลือกผู้ใช้ที่จะถอนเงิน");
  
        const row = new ActionRowBuilder().addComponents(menu);
  
        return interaction.reply({
          content: "💸 เลือกผู้ใช้",
          components: [row],
          ephemeral: true
        });
      }
  
      if (action === "balance") {
        const db = require("../../database/database");
        const config = require("../../config/config");
  
        const row = db.prepare(`
          SELECT COALESCE(balance, 0) AS balance
          FROM balances
          WHERE user = ?
        `).get(config.mainBalanceId);
  
        const balance = row?.balance ?? 0;
  
        return interaction.reply({
          content: `🏦 ยอดเงินกองกลาง: **${Number(balance).toLocaleString()}**`,
          ephemeral: true
        });
      }
    }
  };