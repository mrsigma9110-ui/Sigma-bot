const { cmd, commands } = require('../../inconnuboy');
const config = require('../../config');

const icons = { general:'🌐', group:'👥', settings:'⚙️', owner:'👑', tools:'🛠️', fun:'🎭', media:'🎬', download:'⬇️', security:'🛡️', misc:'📦' };
function grouped(filter) {
    const out = {};
    for (const c of commands) {
        if (c.dontAddCommandList || !c.pattern || (filter && c.category !== filter)) continue;
        const cat = String(c.category || 'misc').toLowerCase();
        (out[cat] ||= []).push(c.pattern);
    }
    for (const k of Object.keys(out)) out[k] = [...new Set(out[k])].sort();
    return out;
}
function render(filter) {
    const groups = grouped(filter);
    let text = `╭━━━〔 ⚡ ${config.BOT_NAME} 〕━━━╮\n┃ Prefix: ${config.PREFIX}\n┃ Commands: ${commands.filter(c=>!c.dontAddCommandList).length}\n╰━━━━━━━━━━━━━━━━━━╯\n`;
    for (const [cat, list] of Object.entries(groups)) {
        text += `\n╭── ${icons[cat] || '📦'} *${cat.toUpperCase()}* ──╮\n`;
        text += list.map(x => `│ ${config.PREFIX}${x}`).join('\n');
        text += `\n╰────────────────╯\n`;
    }
    return text;
}
const menuContext = { isForwarded: true, forwardingScore: 999, forwardedNewsletterMessageInfo: { newsletterJid: config.NEWSLETTER_JID, newsletterName: config.NEWSLETTER_NAME, serverMessageId: 1 } };
cmd({ pattern:'menu', alias:['allmenu','fullmenu'], desc:'Fast full command menu', category:'general', react:'📜' }, async (conn, mek, m, { from, reply }) => conn.sendMessage(from, { text: render(), contextInfo: menuContext }, { quoted: mek }));
cmd({ pattern:'groupmenu', alias:['gmenu'], desc:'Fast group command menu', category:'group', react:'👥' }, async (conn, mek, m, { from, reply, isGroup }) => { if (!isGroup) return reply('❌ Group only.'); return conn.sendMessage(from, { text: render('group'), contextInfo: menuContext }, { quoted: mek }); });
cmd({ pattern:'funmenu', alias:['fmenu'], desc:'Fast fun command menu', category:'fun', react:'🎭' }, async (conn, mek, m, { from }) => conn.sendMessage(from, { text: render('fun'), contextInfo: menuContext }, { quoted: mek }));
cmd({ pattern:'settingmenu', alias:['settingsmenu','smenu'], desc:'Fast settings menu', category:'settings', react:'⚙️' }, async (conn, mek, m, { from }) => conn.sendMessage(from, { text: render('settings'), contextInfo: menuContext }, { quoted: mek }));
