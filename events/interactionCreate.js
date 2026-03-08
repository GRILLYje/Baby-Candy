const {
    ActionRowBuilder,
    UserSelectMenuBuilder,
    StringSelectMenuBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} = require("discord.js");

const sendLog = require("../interactions/modals/activityModal");
const summary = require("../interactions/selects/summary");
const leaveModal = require("../interactions/modals/leaveModal");

const memberCache = new Map();

module.exports = {
    name: "interactionCreate",

    async execute(interaction, client) {

        try {

            /* Slash Command */

            if (interaction.isChatInputCommand()) {

                const command = client.commands.get(interaction.commandName);
                if (!command) return;

                await command.execute(interaction, client);
                return;

            }

            /* เลือกประเภทกิจกรรม */

            if (interaction.isStringSelectMenu()) {

                if (interaction.customId === "activity_type") {

                    const type = interaction.values[0];

                    /* แจ้งลา */

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

                    /* reset panel */

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

                    /* เลือกสมาชิก */

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

            }

            const start = new TextInputBuilder()
                .setCustomId("start")
                .setLabel("วันที่เริ่มลา (ตัวอย่าง 09/03/2569)")
                .setStyle(TextInputStyle.Short)
                .setPlaceholder("วัน/เดือน/ปี เช่น 09/03/2569")
                .setRequired(true);

            const end = new TextInputBuilder()
                .setCustomId("end")
                .setLabel("วันที่สิ้นสุด (ตัวอย่าง 12/03/2569)")
                .setStyle(TextInputStyle.Short)
                .setPlaceholder("วัน/เดือน/ปี เช่น 12/03/2569")
                .setRequired(true);

            const reason = new TextInputBuilder()
                .setCustomId("reason")
                .setLabel("เหตุผลการลา")
                .setStyle(TextInputStyle.Paragraph)
                .setPlaceholder("ตัวอย่าง: ติดธุระ / สอบ / ไม่ว่าง")
                .setRequired(true);

            /* เลือกสมาชิก */

            if (interaction.isUserSelectMenu()) {

                const type = interaction.customId.split("_")[1];
            
                /* summary */
            
                if (type === "summary") {
                    await summary(interaction);
                    return;
                }
            
                const members = interaction.values;
            
                /* เก็บข้อมูลกิจกรรม */
            
                client.pendingActivity.set(interaction.user.id, {
                    type: type,
                    members: members
                });
            
                /* บอกให้ส่งรูป */
            
                await interaction.reply({
                    content: "📸 กรุณาส่งรูปหลักฐานได้เลย (Ctrl+V หรือ Upload)",
                    ephemeral: true
                });
            
                return;
            }

            /* modal submit */

            if (interaction.isModalSubmit()) {

                if (interaction.customId === "leave_modal") {
                    return leaveModal(interaction);
                }

                const cache = memberCache.get(interaction.user.id);

                if (!cache) {
                    return interaction.reply({
                        content: "ไม่พบข้อมูลกิจกรรม",
                        ephemeral: true
                    });
                }

                interaction.activityData = cache;

                await sendLog(interaction);

                memberCache.delete(interaction.user.id);

                return;

            }

        } catch (err) {

            console.log("Interaction Error:", err);

            if (!interaction.replied) {
                await interaction.reply({
                    content: "เกิดข้อผิดพลาด",
                    ephemeral: true
                });
            }

        }

    }

};