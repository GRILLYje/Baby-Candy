const db = require("../../database/database");
const { EmbedBuilder } = require("discord.js");

module.exports = {

id:"add_money",

async execute(interaction){

await interaction.deferReply({ flags:64 });

const user = interaction.fields.getTextInputValue("user");
const amount = Number(interaction.fields.getTextInputValue("amount"));
const proof = interaction.fields.getTextInputValue("proof");
const note = interaction.fields.getTextInputValue("note");


const row = db.prepare(`
SELECT balance FROM balances WHERE user = ?
`).get(user);

if(!row){

db.prepare(`
INSERT INTO balances (user,balance)
VALUES (?,?)
`).run(user,amount);

}else{

db.prepare(`
UPDATE balances
SET balance = balance + ?
WHERE user = ?
`).run(amount,user);

}

db.prepare(`
INSERT INTO money_logs (type,user,amount,note,date)
VALUES ('deposit',?,?,?,?)
`).run(user,amount,note,Date.now());

const embed = new EmbedBuilder()
.setTitle("💰 ฝากเงิน")
.setDescription(`
👤 ผู้ใช้: ${user}
💰 จำนวน: ${amount}
📝 หมายเหตุ: ${note || "-"}
`)
.setTimestamp();

const channel = await interaction.client.channels.fetch(process.env.MONEY_LOG_CHANNEL);

await channel.send({embeds:[embed]});

await interaction.editReply({
content:"✅ ฝากเงินสำเร็จ"
});

}

};