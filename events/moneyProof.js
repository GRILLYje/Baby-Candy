const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const db = require("../database/database");
const config = require("../config/config");

module.exports = {
  name: "messageCreate",

  async execute(message, client) {
    try {
      if (message.author.bot) return;
      if (!message.guild) return;
      if (!client.pendingMoney) return;

      console.log("Message received:", message.author.tag);

      const data = client.pendingMoney.get(message.author.id);
      console.log("PendingMoney:", data);

      if (!data) return;

      if (!data.amount) {
        const msg = await message.reply("❌ ยังไม่ได้กรอกจำนวนเงิน");
        setTimeout(() => msg.delete().catch(() => {}), 5000);
        return;
      }

      // ส่งเฉพาะตอนมีรูป
      if (!message.attachments.size) return;

      const amount = Number(data.amount);
      if (isNaN(amount) || amount <= 0) {
        const msg = await message.reply("❌ จำนวนเงินไม่ถูกต้อง");
        setTimeout(() => msg.delete().catch(() => {}), 5000);
        return;
      }

      const mainBalanceId = config.mainBalanceId;
      if (!mainBalanceId) {
        const msg = await message.reply("❌ ยังไม่ได้ตั้งค่า MAIN_BALANCE_ID");
        setTimeout(() => msg.delete().catch(() => {}), 5000);
        return;
      }

      const attachment = message.attachments.first();
      const file = new AttachmentBuilder(attachment.url, {
        name: "proof.png"
      });

      // ดึงยอดกองกลาง
      let currentRow = db.prepare(`
        SELECT COALESCE(balance, 0) AS balance
        FROM balances
        WHERE user = ?
      `).get(mainBalanceId);

      // ถ้ายังไม่มี row กองกลาง ให้สร้าง
      if (!currentRow) {
        db.prepare(`
          INSERT INTO balances (user, balance)
          VALUES (?, ?)
        `).run(mainBalanceId, 0);

        currentRow = { balance: 0 };
      }

      const currentBalance = currentRow.balance ?? 0;

      // ถอน: เช็กยอดก่อน
      if (data.type === "withdraw" && currentBalance < amount) {
        const msg = await message.reply("❌ ยอดเงินกองกลางไม่พอสำหรับการถอน");
        setTimeout(() => msg.delete().catch(() => {}), 5000);
        return;
      }

      // อัปเดตกองกลางเท่านั้น
      if (data.type === "withdraw") {
        db.prepare(`
          UPDATE balances
          SET balance = COALESCE(balance, 0) - ?
          WHERE user = ?
        `).run(amount, mainBalanceId);
      } else {
        db.prepare(`
          UPDATE balances
          SET balance = COALESCE(balance, 0) + ?
          WHERE user = ?
        `).run(amount, mainBalanceId);
      }

      // ดึงยอดล่าสุด
      const updatedRow = db.prepare(`
        SELECT COALESCE(balance, 0) AS balance
        FROM balances
        WHERE user = ?
      `).get(mainBalanceId);

      const balance = updatedRow?.balance ?? 0;

      const isWithdraw = data.type === "withdraw";
      const color = isWithdraw ? "#E74C3C" : "#2ECC71";
      const title = isWithdraw ? "💸 Withdraw Log" : "💰 Deposit Log";
      const personLabel = isWithdraw ? "👤 คนถอน" : "👤 คนฝาก";
      const amountLabel = isWithdraw ? "💸 Amount" : "💰 Amount";

      const embed = new EmbedBuilder()
        .setColor(color)
        .setTitle(title)
        .addFields(
          { name: personLabel, value: `<@${data.target}>`, inline: true },
          { name: amountLabel, value: `${amount.toLocaleString()}`, inline: true },
          { name: "🏦 Balance Main", value: `${Number(balance).toLocaleString()}`, inline: true },
          { name: "📝 Note", value: data.note || "-" }
        )
        .setImage("attachment://proof.png")
        .setTimestamp();

      const logChannel = message.guild.channels.cache.get(config.moneyLogChannel);

      if (logChannel) {
        await logChannel.send({
          embeds: [embed],
          files: [file]
        });
      }

      await message.delete().catch(() => {});
      client.pendingMoney.delete(message.author.id);

    } catch (err) {
      console.error("moneyProof Error:", err);

      try {
        await message.reply("❌ เกิดข้อผิดพลาดในระบบเงิน");
      } catch {}
    }
  }
};