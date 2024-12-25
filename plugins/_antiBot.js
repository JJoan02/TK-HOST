let handler = async (m, { conn, args, usedPrefix, command }) => {
    let chat = global.db.data.chats[m.chat] || {};
    if (args[0] === 'on') {
        if (chat.antiBot) return conn.reply(m.chat, '🚩 AntiBot ya está activado.', m);
        chat.antiBot = true;
        await conn.reply(m.chat, '🚩 AntiBot activado para este grupo.', m);
    } else if (args[0] === 'off') {
        if (!chat.antiBot) return conn.reply(m.chat, '🚩 AntiBot ya está desactivado.', m);
        chat.antiBot = false;
        await conn.reply(m.chat, '🚩 AntiBot desactivado para este grupo.', m);
    } else {
        await conn.reply(m.chat, `*Configurar AntiBot*. Escriba "on" para activar y "off" para desactivar.`, m);
    }
};

// Función para detectar y eliminar bots
conn.on('group-participants-update', async (update) => {
    const { id, participants, action } = update;

    // Solo ejecutar si AntiBot está activado
    let chat = global.db.data.chats[id] || {};
    if (!chat.antiBot) return;

    if (action === 'add') {
        for (let participant of participants) {
            let user = await conn.getContact(participant);

            // Excepciones: owner y el propio bot
            if (participant === conn.user.jid || global.owner.includes(participant)) continue;

            // Lógica para detectar bots (puedes personalizarla)
            let isBot = /bot|robot/i.test(user.notify || user.name || '') || 
                        participant.endsWith('@g.us');

            if (isBot) {
                await conn.groupParticipantsUpdate(id, [participant], 'remove'); // Elimina al bot
                await conn.reply(id, `🤖 Bot detectado y eliminado: ${user.notify || participant}`, null);
            }
        }
    }
});

handler.help = ['antibot *<on/off>*'];
handler.tags = ['group'];
handler.command = ['antibot'];
handler.group = true;
handler.admin = true;

export default handler;
