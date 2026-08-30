const { getUserConfigFromMongoDB } = require('./database');

async function groupEvents(conn, update) {
    try {
        const metadata = await conn.groupMetadata(update.id);
        const groupName = metadata.subject;
        const botNumber = String(conn.user?.id || '').split(':')[0].split('@')[0];
        const cfg = await getUserConfigFromMongoDB(botNumber);
        const groupCfg = cfg.GROUP_SETTINGS?.[update.id] || {};
        const welcomeOn = groupCfg.WELCOME_ENABLE === undefined ? true : String(groupCfg.WELCOME_ENABLE) === 'true';
        const goodbyeOn = groupCfg.GOODBYE_ENABLE === undefined ? true : String(groupCfg.GOODBYE_ENABLE) === 'true';

        for (const jid of update.participants || []) {
            const number = jid.split('@')[0];
            const mentionTag = `@${number}`;
            let userName = number;
            try {
                const contact = metadata.participants.find(p => p.id === jid);
                if (contact?.name) userName = contact.name;
            } catch {}

            if (update.action === 'add' && welcomeOn) {
                const text = `╭───〔 *WELCOME* 〕───⬣\n❀ Hey ${mentionTag}\n\n🏷️ *Name:* ${userName}\n🏰 *Group:* ${groupName}\n\n⚠️ Please read group rules!\n╰────────────────⬣`;
                await conn.sendMessage(update.id, { text, mentions: [jid] });
            }
            if (update.action === 'remove' && goodbyeOn) {
                const text = `╭───〔 *GOODBYE* 〕───⬣\n😔 ${mentionTag} left the group\n\n🏷️ *Name:* ${userName}\n📢 Hope to see you again!\n╰────────────────⬣`;
                await conn.sendMessage(update.id, { text, mentions: [jid] });
            }
        }
    } catch (err) {
        console.log('GroupEvents Error:', err.message);
    }
}
module.exports = { groupEvents };
