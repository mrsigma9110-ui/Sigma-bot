const { cmd } = require('../../inconnuboy');
const {
    getUserConfigFromMongoDB,
    updateUserConfigInMongoDB
} = require('../../lib/database');

const URL_RE = /(?:https?:\/\/)?(?:www\.)?(?:[a-z0-9-]+\.)+(?:com|org|net|co|pk|biz|id|info|xyz|online|site|tech|shop|store|app|dev|io|ai|me)(?:\/[^\s]*)?|whatsapp\.com\/(?:channel\/|group\/)|wa\.me\//i;

// ==================== ANTILINK ON / OFF ====================
cmd({
    pattern: 'antilink',
    alias: ['antilinks'],
    desc: 'Group anti-link protection',
    category: 'security',
    react: '🔗'
}, async (
    conn,
    mek,
    m,
    {
        from,
        sender,
        args,
        reply,
        isGroup,
        isAdmins,
        isOwner
    }
) => {
    if (!isGroup) {
        return reply('❌ This command can only be used in a group.');
    }

    if (!isOwner && !isAdmins) {
        return reply('❌ Only group admins can use this command.');
    }

    const action = String(args?.[0] || '').toLowerCase();

    if (!['on', 'off'].includes(action)) {
        return reply('❌ Usage: *.antilink on* or *.antilink off*');
    }

    try {
        const botNumber = String(conn.user?.id || '')
            .split(':')[0]
            .split('@')[0];

        if (!botNumber) {
            return reply('❌ Bot number not found.');
        }

        const cfg = await getUserConfigFromMongoDB(botNumber);

        cfg.GROUP_SETTINGS = cfg.GROUP_SETTINGS || {};
        cfg.GROUP_SETTINGS[from] = cfg.GROUP_SETTINGS[from] || {};

        cfg.GROUP_SETTINGS[from].ANTI_LINK = action === 'on';

        await updateUserConfigInMongoDB(botNumber, cfg);

        if (action === 'on') {
            return reply(
                '╭━━〔 🔗 ANTILINK 〕━━╮\n' +
                '┃\n' +
                '┃ ✅ *Anti-Link is now ON*\n' +
                '┃\n' +
                '┃ 🚫 Links will be removed\n' +
                '┃ 👮 Admins are ignored\n' +
                '┃\n' +
                '╰━━━━━━━━━━━━━━━━╯'
            );
        }

        return reply(
            '╭━━〔 🔗 ANTILINK 〕━━╮\n' +
            '┃\n' +
            '┃ ❌ *Anti-Link is now OFF*\n' +
            '┃\n' +
            '┃ 🔓 Links are allowed\n' +
            '┃\n' +
            '╰━━━━━━━━━━━━━━━━╯'
        );

    } catch (error) {
        console.error('ANTILINK COMMAND ERROR:', error);
        return reply('❌ Failed to update Anti-Link setting.');
    }
});

// ==================== ANTILINK DETECTOR ====================
cmd({
    on: 'body'
}, async (
    conn,
    mek,
    m,
    {
        body,
        from,
        sender,
        isGroup,
        isAdmins,
        isOwner
    }
) => {
    try {
        if (!isGroup || !body || !sender) return;

        // Admins/owner are ignored
        if (isAdmins || isOwner) return;

        // No link = nothing to do
        if (!URL_RE.test(String(body))) return;

        const botNumber = String(conn.user?.id || '')
            .split(':')[0]
            .split('@')[0];

        if (!botNumber) return;

        const cfg = await getUserConfigFromMongoDB(botNumber);

        const antiLink =
            cfg?.GROUP_SETTINGS?.[from]?.ANTI_LINK === true;

        if (!antiLink) return;

        // Delete link message
        try {
            await conn.sendMessage(from, {
                delete: mek.key
            });
        } catch (deleteError) {
            console.error('ANTILINK DELETE ERROR:', deleteError);
        }

        // Warn user
        try {
            await conn.sendMessage(from, {
                text:
                    `🚫 *ANTI-LINK*\n\n` +
                    `@${String(sender).split('@')[0]}, links are not allowed in this group.`,
                mentions: [sender]
            });
        } catch (warnError) {
            console.error('ANTILINK WARNING ERROR:', warnError);
        }

    } catch (error) {
        console.error('ANTILINK DETECTOR ERROR:', error);
    }
});
