const { cmd } = require('../../inconnuboy');
const { getUserConfigFromMongoDB, updateUserConfigInMongoDB } = require('../../lib/database');

async function setFlag(number, key, value, reply, label) {
    const cfg = await getUserConfigFromMongoDB(number);
    cfg[key] = value;
    await updateUserConfigInMongoDB(number, cfg);
    return reply(`*${label}: ${value ? 'ON ✅' : 'OFF ❌'}*`);
}

cmd({ pattern: 'private', alias: ['priv'], desc: 'Bot works only for owner', category: 'settings', react: '🔒' }, async (conn, mek, m, { sender, args, reply, isOwner }) => {
    if (!isOwner) return reply('❌ Owner only.');
    const a = String(args[0] || '').toLowerCase();
    if (!['on','off'].includes(a)) return reply('Usage: *.private on/off*');
    return setFlag(sender.split('@')[0], 'WORK_TYPE', a === 'on' ? 'private' : 'public', reply, 'Private Mode');
});

cmd({ pattern: 'public', alias: ['pub'], desc: 'Enable public bot mode', category: 'settings', react: '🌐' }, async (conn, mek, m, { sender, reply, isOwner }) => {
    if (!isOwner) return reply('❌ Owner only.');
    return setFlag(sender.split('@')[0], 'WORK_TYPE', 'public', reply, 'Public Mode');
});

cmd({ pattern: 'admin', alias: ['adminmode'], desc: 'Only group admins can use commands', category: 'settings', react: '🛡️' }, async (conn, mek, m, { from, sender, botNumber2, args, reply, isGroup, isAdmins, isOwner }) => {
    if (!isGroup) return reply('❌ Group only.');
    if (!isOwner && !isAdmins) return reply('❌ Group admins only.');
    const a = String(args[0] || '').toLowerCase();
    if (!['on','off'].includes(a)) return reply('Usage: *.admin on/off*');
    return setFlag(String(botNumber2 || sender).split('@')[0], 'ADMIN_MODE', a === 'on', reply, 'Admin Mode');
});

const groupFlags = [
    ['antispam', 'ANTISPAM', 'Anti-spam'],
    ['antibadword', 'ANTIBADWORD', 'Anti-badword'],
    ['antibot', 'ANTIBOT', 'Anti-bot'],
    ['antidelete', 'ANTIDELETE', 'Anti-delete'],
    ['antihijack', 'ANTI_HIJACK', 'Anti-hijack'],
    ['protect', 'PROTECT', 'Group Protect'],
    ['welcome', 'WELCOME_ENABLE', 'Welcome'],
    ['goodbye', 'GOODBYE_ENABLE', 'Goodbye']
];
for (const [pattern, key, label] of groupFlags) {
    cmd({ pattern, desc: `${label} on/off`, category: 'group', react: '⚙️' }, async (conn, mek, m, { sender, botNumber2, args, reply, isGroup, isAdmins, isOwner }) => {
        if (!isGroup) return reply('❌ Group only.');
        if (!isOwner && !isAdmins) return reply('❌ Group admins only.');
        const a = String(args[0] || '').toLowerCase();
        if (!['on','off'].includes(a)) return reply(`Usage: *.${pattern} on/off*`);
        const botNumber = String(botNumber2 || '').split('@')[0];
        const cfg = await getUserConfigFromMongoDB(botNumber);
        cfg.GROUP_SETTINGS ||= {};
        cfg.GROUP_SETTINGS[isGroup ? (m.key.remoteJid || '') : ''] ||= {};
        cfg.GROUP_SETTINGS[m.key.remoteJid][key] = a === 'on';
        await updateUserConfigInMongoDB(botNumber, cfg);
        return reply(`*${label}: ${a === 'on' ? 'ON ✅' : 'OFF ❌'}*`);
    });
}
