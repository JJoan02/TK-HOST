let handler = async (m, { conn, args, usedPrefix, command, isAdmin, isOwner }) => {
    try {
        if (!m.isGroup) return; // Ignorar si no es un grupo

        const groupMetadata = await conn.groupMetadata(m.chat);
        const groupName = groupMetadata.subject || 'Este grupo';
        let groupIcon;

        try {
            groupIcon = await conn.profilePictureUrl(m.chat, 'image'); // Intentar obtener la imagen del grupo
        } catch {
            groupIcon = '/storage/img/Joan.jpg'; // Usar imagen predeterminada si no hay imagen del grupo
        }

        // Verificar que el bot sea admin
        const botNumber = conn.user.jid || conn.user.id || conn.user;
        const botMember = groupMetadata.participants.find(p => p.id === botNumber);
        const botIsAdmin = botMember && (botMember.admin === 'admin' || botMember.admin === 'superadmin');
        if (!botIsAdmin) return; // Ignorar si el bot no es admin

        // Verificar que el ejecutor sea admin o owner
        if (!isAdmin && !isOwner) return; // Ignorar si el ejecutor no es admin ni owner

        // Identificar al usuario objetivo
        let user = m.mentionedJid && m.mentionedJid[0]
            ? m.mentionedJid[0]
            : (m.quoted ? m.quoted.sender : null);

        if (!user) {
            let usageText = `⚙️ Uso del comando:\n` +
                `- ${usedPrefix}${command} @usuario\n` +
                `- ${usedPrefix}${command} @usuario [motivo]\n\n` +
                `Ejemplo:\n${usedPrefix}${command} @usuario No se permiten bots externos.`;
            return conn.reply(m.chat, usageText, m, { mentions: conn.parseMention(usageText) });
        }

        // Evitar expulsar al propio ejecutor, al bot y demás
        if (user === m.sender) {
            return conn.reply(m.chat, '😅 No puedes expulsarte a ti mismo.', m);
        }
        if (user === botNumber) {
            return conn.reply(m.chat, '🤖 No puedo expulsarme a mí mismo.', m);
        }

        // Verificar que el usuario objetivo esté en el grupo
        const participant = groupMetadata.participants.find(p => p.id === user);
        if (!participant) {
            return conn.reply(m.chat, '❌ El usuario mencionado no se encuentra en el grupo.', m);
        }

        // Evitar expulsar administradores, propietario o creador del grupo
        const ownerId = groupMetadata.owner || groupMetadata.creator || null;
        const isTargetAdmin = participant.admin === 'admin' || participant.admin === 'superadmin';
        if (isTargetAdmin) {
            return conn.reply(m.chat, '🚫 No puedo eliminar a un administrador o propietario del grupo.', m);
        }

        if (ownerId && user === ownerId) {
            return conn.reply(m.chat, '🚫 No puedo eliminar al creador del grupo.', m);
        }

        // Determinar motivo
        let reason = args.slice(1).join(' ').trim() || 'Sin motivo especificado';

        // Normalizar JID
        user = user.replace(/[^0-9]/g, '') + '@s.whatsapp.net';

        // Mensaje privado antes de la expulsión
        let privateMessage = `👋 Hola, lamentamos informarte que has sido eliminado del grupo *"${groupName}"*.\n\n` +
            `📜 Motivo: *${reason}*\n\n` +
            `Si consideras que ha sido un error o deseas más información, por favor ponte en contacto con un administrador del grupo.\n\n` +
            `*Atentamente, la administración del grupo.*`;

        // Intentar enviar el mensaje privado antes de la expulsión
        try {
            if (groupIcon.startsWith('/')) { // Si es una imagen local
                await conn.sendMessage(user, { image: { url: groupIcon }, caption: privateMessage }, { quoted: null });
            } else {
                await conn.sendMessage(user, { image: { url: groupIcon }, caption: privateMessage }, { quoted: null });
            }
        } catch (e) {
            console.error(`❗ No se pudo enviar el mensaje privado a ${user}:`, e);
        }

        // Expulsar al usuario
        await conn.groupParticipantsUpdate(m.chat, [user], 'remove');

    } catch (error) {
        console.error('Error en comando kick:', error);
    }
};

handler.help = ['kick @user [motivo]', 'expulsar @user [motivo]'];
handler.tags = ['group'];
handler.command = ['kick', 'expulsar'];
handler.admin = true; // Requiere admin del grupo
handler.group = true; // Solo en grupos
handler.botAdmin = true; // El bot debe ser admin

export default handler;
