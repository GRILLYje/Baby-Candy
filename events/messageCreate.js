const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

module.exports = {
  name: "messageCreate",

  async execute(message, client) {   // ต้องมี async ตรงนี้

    if (message.author.bot) return;

    const data = client.pendingActivity.get(message.author.id);
    if (!data) return;

    if (!message.attachments.size) return;

    const attachment = message.attachments.first();

    const file = new AttachmentBuilder(attachment.url, {
      name: "proof.png"
    });

    const embed = new EmbedBuilder()
      .setColor("#57F287")
      .setTitle(`กิจกรรม ${data.type}`)
      .setDescription(`สมาชิก:\n${data.members.map(id => `<@${id}>`).join("\n")}`)
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