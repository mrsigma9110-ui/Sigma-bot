const { cmd, commands } = require('../../inconnuboy');
const config = require('../../config');

cmd({
    pattern: "repo",
    alias: ["sc", "script", "source"],
    desc: "Get bot source code and repository link",
    category: "main",
    react: "📁",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        let repoText = `*╭────⬡ ${config.BOT_NAME} ⬡────⭓*
*├▢ 📂 Repository:* 🦋⍣⃝𝗦𝗜𝗚𝗠𝗔-𝗠𝗗
*├▢ 👨‍💻 Owner:* ${config.OWNER_NAME}
*├▢ 🏷️ Version:* 1.0
*╰─────────────────⭓*

*╭────⬡ LINK ⬡────*
*├▢ 🌐 Web:* https://khan-zada-f3a760e88caa.herokuapp.com/
*╰────────────────*

> *© Powered by 🦋⍣⃝𝗦𝗜𝗚𝗠𝗔-𝗠𝗗*`;

        await conn.sendMessage(from, {
            image: { url: config.MENU_IMAGE_URL || 'https://mhcloud.kesug.com/images/sigma-techx.png' },
            caption: repoText,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: config.NEWSLETTER_JID,
                    newsletterName: config.BOT_NAME,
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`❌ Error: ${e.message}`);
    }
});

