const { cmd } = require('../../inconnuboy');
const config = require('../../config');

cmd({
    pattern: "uptime",
    alias: ["runtime", "up"],
    desc: "Check bot uptime",
    category: "utility",
    react: "⏱️",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    try {
        // ⏳ React - processing
        await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } });

        const formatUptime = (seconds) => {
            const days = Math.floor(seconds / (3600 * 24));
            const hours = Math.floor((seconds % (3600 * 24)) / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const secs = Math.floor(seconds % 60);
            
            let timeString = '';
            if (days > 0) timeString += `${days} day${days > 1 ? 's' : ''} `;
            if (hours > 0) timeString += `${hours} hour${hours > 1 ? 's' : ''} `;
            if (minutes > 0) timeString += `${minutes} minute${minutes > 1 ? 's' : ''} `;
            if (secs > 0 || timeString === '') timeString += `${secs} second${secs !== 1 ? 's' : ''}`;
            
            return timeString.trim();
        };

        const uptime = formatUptime(process.uptime());
        
        await conn.sendMessage(from, { 
            text: `⏱️ *Uptime:* ${uptime}`,
            contextInfo: {
                isForwarded: true,
                forwardingScore: 999,
                mentionedJid: [sender],
                forwardedNewsletterMessageInfo: { newsletterJid: config.NEWSLETTER_JID, newsletterName: config.NEWSLETTER_NAME, serverMessageId: 1 }
            }
        }, { quoted: mek });

        // ✅ React - success
        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });

    } catch (e) {
        console.error("Error in uptime command:", e);
        // ❌ React - error
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
        await reply(`❌ Error checking uptime: ${e.message}`);
    }
});
