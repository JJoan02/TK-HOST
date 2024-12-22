let handler = async (m, { conn, isAdmin, isROwner }) => {
    // Verifica si el usuario es admin, el propietario o el número del bot
    if (!(isAdmin || isROwner || m.sender === conn.user.jid)) {
        return conn.reply(m.chat, '🚫 No tienes permisos para usar este comando.', m)
    }

    // Quita el baneo del chat si cumple los requisitos
    global.db.data.chats[m.chat].isBanned = false
    await conn.reply(m.chat, '🚩 Bot activo en este grupo.', m, rcanal)
    await m.react('✅')
}

// Lista de ayuda, etiquetas y comandos disponibles
handler.help = ['desbanearbot', 'unbanchat']
handler.tags = ['group']
handler.command = ['desbanearbot', 'unbanchat'] // Los comandos activadores
handler.group = true // Solo se puede usar en grupos
export default handler
