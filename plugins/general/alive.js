const { cmd, commands } = require('../../inconnuboy');
const config = require('../../config');

// Commande Alive
cmd({
    pattern: "alive",
    desc: "Check if bot is alive",
    category: "general",
    react: "💫"
},
async(conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, { 
            image: { url: config.IMAGE_PATH },
            caption: `*${config.NEWSLETTER_NAME}*\n\n> ${config.BOT_FOOTER}`,
            contextInfo: { isForwarded: true, forwardingScore: 999, forwardedNewsletterMessageInfo: { newsletterJid: config.NEWSLETTER_JID, newsletterName: config.NEWSLETTER_NAME, serverMessageId: 1 } }
        }, { quoted: mek });
    } catch (e) {
        reply("Error: " + e.message);
    }
});
