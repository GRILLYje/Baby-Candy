const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

module.exports = {
  name: "messageCreate",

  async execute(message, client) {

    if (message.author.bot) return;

    const data = client.pendingActivity.get(message.author.id);
    if (!data) return;

    if (!message.attachments.size) return;

    const attachment = message.attachments.first();

    const file = new AttachmentBuilder(attachment.url, {
      name: "proof.png"
    });

    const embed = new EmbedBuilder()
      .setColor("#F5A9C8")
      .setTitle(`📒 Activity Log : ${data.type}`)
      .addFields(
        {
          name: "👤 ผู้บันทึก",
          value: `<@${message.author.id}>`
        },
        {
          name: "👥 สมาชิกที่เข้าร่วม",
          value: data.members.map(id => `<@${id}>`).join("\n")
        },
        {
          name: "📝 หมายเหตุ",
          value: "ไม่มี"
        }
      )
      .setImage("attachment://proof.png")
      .setTimestamp();

    const channelId = require("../config/config").channels[data.type];
    const logChannel = message.guild.channels.cache.get(channelId);

    if (!logChannel) return;

    await logChannel.send({
      embeds: [embed],
      files: [file]
    });

    await message.delete().catch(()=>{});

    client.pendingActivity.delete(message.author.id);

  }
};