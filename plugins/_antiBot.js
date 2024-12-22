import { areJidsSameUser } from '@whiskeysockets/baileys';

export async function before(m, { participants, conn }) {
  if (!m.isGroup) return; // Solo se ejecuta en grupos

  let chat = global.db.data.chats[m.chat];
  if (!chat.antiBot) return; // Verificar si el modo anti-bot está activado

  const botJid = global.conn.user.jid; // JID del bot principal
  const allowedBots = []; // Lista de bots permitidos en el grupo (en caso de ser necesario)

  // Revisión de participantes
  for (let participant of participants) {
    // Ignorar administradores y superadministradores humanos
    if (participant.isAdmin || participant.isSuperAdmin) continue;

    // Detectar si el participante es un bot (JIDs que contienen ":")
    if (participant.id !== botJid && participant.id.includes(':')) {
      // Evitar eliminar bots en la lista blanca
      if (allowedBots.includes(participant.id)) continue;

      try {
        // Intentar eliminar al bot detectado
        await conn.groupParticipantsUpdate(m.chat, [participant.id], 'remove');
        console.log(`✅ Bot eliminado exitosamente: ${participant.id}`);

        // Notificar al grupo sobre la acción
        await conn.sendMessage(
          m.chat,
          `🚫 *Anti-Bot Activado*: Se eliminó al bot ${participant.id} del grupo.`,
          { mentions: [participant.id] }
        );
      } catch (error) {
        // Manejo de errores en la eliminación
        console.error(`❌ Error al intentar eliminar al bot ${participant.id}:`, error);

        // Notificación al grupo en caso de error
        await conn.sendMessage(
          m.chat,
          `⚠️ *Error*: No se pudo eliminar al bot ${participant.id}. Verifica los permisos del bot.`,
          null
        );
      }
    }
  }
}
