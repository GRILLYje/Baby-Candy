const {
    ActionRowBuilder,
    StringSelectMenuBuilder,
    EmbedBuilder
    } = require("discord.js");
    
    module.exports = async (client, channelId) => {
    
    const channel = await client.channels.fetch(channelId).catch(() => null);
    if (!channel) return console.log("Channel not found");
    
    /* ดึงข้อความ */
    
    const messages = await channel.messages.fetch({ limit: 50 });
    
    /* ลบ panel เก่าทั้งหมด */
    
    for (const msg of messages.values()) {
    
    if (
    msg.author.id === client.user.id &&
    msg.components.length > 0 &&
    msg.embeds.length &&
    msg.embeds[0].title === "🦾 Gang Activity Panel"
    ) {
    await msg.delete().catch(() => {});
    }
    
    }
    
    /* สร้าง panel */
    
    const embed = new EmbedBuilder()
    .setColor("#F5A9C8")
    .setTitle("🦾 Gang Activity Panel")
    .setDescription(`
    ใช้สำหรับบันทึกกิจกรรมของสมาชิกแก๊ง 🎀
    
    • เลือกประเภทกิจกรรม
    • เลือกสมาชิกที่เข้าร่วม
    • แนบหลักฐาน
    `);
    
    const select = new StringSelectMenuBuilder()
    .setCustomId("activity_type")
    .setPlaceholder("เลือกประเภทกิจกรรม")
    .addOptions([
    {
    label: "งัดร้าน",
    value: "rob",
    emoji: "💰",
    description: "กิจกรรมงัดร้าน"
    },
    {
    label: "งัดบ้าน",
    value: "house",
    emoji: "🏠",
    description: "กิจกรรมงัดบ้าน"
    },
    {
    label: "แอร์ดรอป",
    value: "airdrop",
    emoji: "📦",
    description: "กิจกรรมแอร์ดรอป"
    },
    {
    label: "สรุปกิจกรรม",
    value: "summary",
    emoji: "📊",
    description: "ดูสรุปกิจกรรมสมาชิก"
    },
    {
    label: "แจ้งลา",
    value: "leave",
    emoji: "📅",
    description: "แจ้งลาหยุดกิจกรรม"
    }
    ]);
    
    const row = new ActionRowBuilder().addComponents(select);
    
    const msg = await channel.send({
    embeds: [embed],
    components: [row]
    });
    
    console.log("Panel Created:", msg.id);
    
    };