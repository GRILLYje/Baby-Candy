require("dotenv").config();

module.exports = {
  token: process.env.TOKEN,
  clientId: process.env.CLIENT_ID,
  guildId: process.env.GUILD_ID,

  moneyLogChannel: process.env.MONEY_LOG_CHANNEL,
  mainBalanceId: process.env.MAIN_BALANCE_ID,

  channels: {
    rob: process.env.ROB_LOG_CHANNEL,
    house: process.env.HOUSE_LOG_CHANNEL,
    airdrop: process.env.AIRDROP_LOG_CHANNEL,
    summary: process.env.SUMMARY_LOG_CHANNEL,
    leave: process.env.LEAVE_LOG_CHANNEL,
    delivery: process.env.DELIVERY_LOG_CHANNEL
  }
};