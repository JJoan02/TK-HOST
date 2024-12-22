const linkRegex = /chat.whatsapp.com\/(?:invite\/)?([0-9A-Za-z]{20,24})/i;

export async function before(m, { conn, isAdmin, isBotAdmin }) {
    if (m.isBaileys && m.fromMe) return true;
    if (!m.isGroup) return false;

    const chat = global.db.data.chats[m.chat];
    const botSettings = global.db.data.settings[this.user.jid] || {};
    const isGroupLink = linkRegex.exec(m.text);

    // Ignorar si el bot no es admin, o si el usuario es admin, owner o el bot
    if (!isBotAdmin || isAdmin || m.sender === this.user.jid || m.sender === botSettings.owner) return true;

    if (chat.antiLink && isGroupLink) {
        // Eliminar el mensaje del enlace
        await conn.sendMessage(m.chat, { delete: m.key });

        // Inicializar el contador de advertencias del usuario
        chat.warnings = chat.warnings || {};
        const userWarnings = (chat.warnings[m.sender] = (chat.warnings[m.sender] || 0) + 1);

        // Enviar notificación privada
        if (userWarnings < 3) {
            await conn.sendMessage(
                m.sender,
                { text: `🚩 *Advertencia ${userWarnings}/3*: No compartas enlaces de grupos.\nSi llegas a 3 advertencias serás eliminado.` },
                { quoted: m }
            );
        } else if (userWarnings === 3) {
            // Tercera advertencia: eliminar al usuario del grupo
            await conn.sendMessage(
                m.sender,
                { text: '❌ Has sido eliminado del grupo por exceder el límite de advertencias.' },
                { quoted: m }
            );
            await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
            delete chat.warnings[m.sender]; // Reiniciar advertencias después de eliminar
        }

        return true;
    }

    return true;
}
