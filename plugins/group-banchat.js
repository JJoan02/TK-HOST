let handler = async (m, { conn, isAdmin, isROwner }) => {
    // Verifica si el usuario es admin, el propietario o el número del bot
    if (!(isAdmin || isROwner || m.sender === conn.user.jid)) {
        return conn.reply(m.chat, '🚫 No tienes permisos para usar este comando.', m)
    }

    // Banea el chat si cumple los requisitos
    global.db.data.chats[m.chat].isBanned = true
    await conn.reply(m.chat, `🚩 Chat baneado con éxito.`, m, rcanal)
    await m.react('✅')
}

// Lista de ayuda, etiquetas y comandos disponibles
handler.help = ['banearbot', 'banchat']
handler.tags = ['group']
handler.command = ['banearbot', 'banchat'] // Los comandos activadores
handler.group = true // Solo se puede usar en grupos
export default handler
