const fs = require("fs");
const {
  ActionRowBuilder,
  UserSelectMenuBuilder,
  StringSelectMenuBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
} = require("discord.js");

const summary = require("../interactions/selects/summary");
const leaveModal = require("../interactions/modals/leaveModal");

module.exports = {
  name: "interactionCreate",

  async execute(interaction, client) {
    if (interaction.customId) {
      console.log("Interaction:", interaction.customId);
    }

    try {
      /* ================= SLASH COMMAND ================= */

      if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        await command.execute(interaction, client);
        return;
      }

      /* ================= ACTIVITY TYPE (แบบเก่า) ================= */

      if (interaction.isStringSelectMenu() && interaction.customId === "activity_type") {
        const type = interaction.values[0];

        /* ===== แจ้งลา ===== */
        if (type === "leave") {
          const modal = new ModalBuilder()
            .setCustomId("leave_modal")
            .setTitle("แจ้งลาหยุดกิจกรรม");

          const start = new TextInputBuilder()
            .setCustomId("start")
            .setLabel("วันที่เริ่มลา (เช่น 09/03/2569)")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

          const end = new TextInputBuilder()
            .setCustomId("end")
            .setLabel("วันที่สิ้นสุด (เช่น 15/03/2569)")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

          const reason = new TextInputBuilder()
            .setCustomId("reason")
            .setLabel("เหตุผล (เช่น ติดธุระ / สอบ / ไม่ว่าง)")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

          modal.addComponents(
            new ActionRowBuilder().addComponents(start),
            new ActionRowBuilder().addComponents(end),
            new ActionRowBuilder().addComponents(reason)
          );

          await interaction.showModal(modal);
          return;
        }

        /* ===== reset panel ===== */
        const resetMenu = new StringSelectMenuBuilder()
          .setCustomId("activity_type")
          .setPlaceholder("เลือกประเภทกิจกรรม")
          .addOptions([
            {
              label: "งัดร้าน",
              value: "rob",
              emoji: "💰"
            },
            {
              label: "งัดบ้าน",
              value: "house",
              emoji: "🏠"
            },
            {
              label: "แอร์ดรอป",
              value: "airdrop",
              emoji: "📦"
            },
            {
              label: "สรุปกิจกรรม",
              value: "summary",
              emoji: "📊"
            },
            {
              label: "แจ้งลา",
              value: "leave",
              emoji: "📅"
            }
          ]);

        const resetRow = new ActionRowBuilder().addComponents(resetMenu);

        await interaction.update({
          content: "เลือกประเภทกิจกรรม",
          components: [resetRow]
        });

        /* ===== เลือกสมาชิก ===== */
        let max = 5;
        if (type === "airdrop") max = 10;
        if (type === "summary") max = 10;

        const menu = new UserSelectMenuBuilder()
          .setCustomId(`members_${type}`)
          .setPlaceholder("เลือกสมาชิก")
          .setMinValues(1)
          .setMaxValues(max);

        const row = new ActionRowBuilder().addComponents(menu);

        await interaction.followUp({
          content: `เลือกสมาชิก (สูงสุด ${max})`,
          components: [row],
          ephemeral: true
        });

        return;
      }

      /* ================= ACTIVITY MEMBERS (แบบเก่า) ================= */

      if (interaction.isUserSelectMenu() && interaction.customId.startsWith("members_")) {
        const type = interaction.customId.split("_")[1];

        /* ===== summary ===== */
        if (type === "summary") {
          await summary(interaction);
          return;
        }

        const members = interaction.values;

        client.pendingActivity.set(interaction.user.id, {
          type,
          members
        });

        await interaction.reply({
          content: "📸 กรุณาส่งรูปหลักฐานได้เลย (Ctrl+V หรือ Upload)",
          ephemeral: true
        });

        return;
      }

      /* ================= MODAL พิเศษของ activity ================= */

      if (interaction.isModalSubmit() && interaction.customId === "leave_modal") {
        await leaveModal(interaction);
        return;
      }

      /* ================= BUTTON ROUTER ================= */

      if (interaction.isButton()) {
        const files = fs.readdirSync("./interactions/buttons");

        for (const file of files) {
          const button = require(`../interactions/buttons/${file}`);
          if (!button.id) continue;

          if (interaction.customId === button.id) {
            console.log("[BUTTON HANDLER]", file);
            await button.execute(interaction, client);
            return;
          }
        }
      }

      /* ================= SELECT ROUTER ================= */

      if (interaction.isAnySelectMenu()) {
        const files = fs.readdirSync("./interactions/selects");

        for (const file of files) {
          const select = require(`../interactions/selects/${file}`);
          if (!select.id) continue;

          if (interaction.customId === select.id) {
            console.log("[SELECT HANDLER]", file);
            await select.execute(interaction, client);
            return;
          }
        }
      }

      /* ================= MODAL ROUTER ================= */

      if (interaction.isModalSubmit()) {
        const files = fs.readdirSync("./interactions/modals");

        for (const file of files) {
          const modal = require(`../interactions/modals/${file}`);
          if (!modal.id) continue;

          if (interaction.customId === modal.id) {
            console.log("[MODAL HANDLER]", file);
            await modal.execute(interaction, client);
            return;
          }
        }
      }

    } catch (err) {
      console.error("Interaction Error:", err);

      try {
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: "❌ เกิดข้อผิดพลาด",
            ephemeral: true
          });
        } else {
          await interaction.reply({
            content: "❌ เกิดข้อผิดพลาด",
            ephemeral: true
          });
        }
      } catch (e) {
        console.error("Reply error:", e);
      }
    }
  }
};