const { EmbedBuilder } = require("discord.js");
const db = require("../../database/database");
const config = require("../../config/config");

module.exports = async (interaction)=>{

const start = interaction.fields.getTextInputValue("start");
const end = interaction.fields.getTextInputValue("end");
const reason = interaction.fields.getTextInputValue("reason");

/* คำนวณวัน */

const startDate = parseThaiDate(start);
const endDate = parseThaiDate(end);

const diff = Math.floor(
    (endDate - startDate) / (1000 * 60 * 60 * 24)
    ) + 1;

/* บันทึก database */

const stmt = db.prepare(`
INSERT INTO leaves (user,start,end,days,reason)
VALUES (?,?,?,?,?)
`);

stmt.run(
interaction.user.id,
start,
end,
diff,
reason
);

function parseThaiDate(dateStr){

    const [day,month,year] = dateStr.split("/").map(Number);
    
    /* แปลง พ.ศ → ค.ศ */
    
    const christianYear = year - 543;
    
    return new Date(christianYear,month-1,day);
    
    }

/* ส่ง log */

const channel = await interaction.client.channels.fetch(config.channels.leave);

const embed = new EmbedBuilder()
.setColor("Yellow")
.setTitle("📅 แจ้งลาหยุดกิจกรรม")
.addFields(
{ name:"สมาชิก", value:`<@${interaction.user.id}>` },
{ name:"ช่วงวันที่", value:`${start} → ${end}` },
{ name:"จำนวนวัน", value:`${diff} วัน` },
{ name:"เหตุผล", value:reason }
)
.setTimestamp();

await channel.send({ embeds:[embed] });

/* ตอบ user */

await interaction.reply({
content:`✅ แจ้งลาสำเร็จ

🚨 กรุณาแจ้งลาล่วงหน้า`,
ephemeral:true
});

};