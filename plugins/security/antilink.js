const { cmd } = require('../../inconnuboy');
const { getUserConfigFromMongoDB, updateUserConfigInMongoDB } = require('../../lib/database');
const URL_RE = /(?:https?:\/\/)?(?:www\.)?(?:[a-z0-9-]+\.)+(?:com|org|net|co|pk|biz|id|info|xyz|online|site|tech|shop|store|app|dev|io|ai|me)(?:\/[^\s]*)?|whatsapp\.com\/(?:channel\/|group\/)|wa\.me\//i;
cmd({ pattern:'antilink', alias:['antilinks'], desc:'Group anti-link protection', category:'security', react:'🔗' }, async (conn, mek, m, { sender, args, reply, isGroup, isAdmins, isOwner }) => {
    if (!isGroup) return reply('❌ Group only.');
    if (!isOwner && !isAdmins) return reply('❌ Group admins only.');
    const a=String(args[0]||'').toLowerCase();
    if(!['on','off'].includes(a)) return reply('Usage: *.antilink on/off*');
    const botNumber=String(conn.user?.id||'').split(':')[0].split('@')[0]; const cfg=await getUserConfigFromMongoDB(botNumber); cfg.GROUP_SETTINGS ||= {}; cfg.GROUP_SETTINGS[from] ||= {}; cfg.GROUP_SETTINGS[from].ANTI_LINK=a==='on'; await updateUserConfigInMongoDB(botNumber,cfg);
    return reply(`*Anti-link: ${a==='on'?'ON ✅':'OFF ❌'}*`);
});
cmd({ on:'body' }, async (conn, mek, m, { body, from, sender, isGroup, reply, isAdmins, isOwner }) => {
    if (!isGroup || !body || isAdmins || isOwner || !URL_RE.test(body)) return;
    const botNumber=String(conn.user?.id||'').split(':')[0].split('@')[0];
    const cfg=await getUserConfigFromMongoDB(botNumber);
    if (String(cfg.GROUP_SETTINGS?.[from]?.ANTI_LINK)!=='true') return;
    try { await conn.sendMessage(from,{delete:mek.key}); } catch(_) {}
    try { await conn.sendMessage(from,{text:`🚫 Link removed: @${sender.split('@')[0]}`,mentions:[sender]}); } catch(_) {}
});
