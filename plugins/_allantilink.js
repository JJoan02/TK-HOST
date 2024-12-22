import fetch from 'node-fetch';

const isLink = /(https?:\/\/[^\s]+)/i; // Expresión regular para detectar enlaces

let handler = m => m;

handler.before = async function (m, { conn, isAdmin, isBotAdmin, isOwner }) {
  if (!m.isGroup) return false; // Solo aplica en grupos
  if (m.isBaileys && m.fromMe) return true; // Ignorar mensajes enviados por el bot

  const chat = global.db.data.chats[m.chat];
  const botNumber = this.user.jid; // Número del bot
  const senderNumber = m.sender.split('@')[0];
  const userKey = `${m.chat}-${m.sender}`;

  // Sistema de advertencias por usuario en cada grupo
  if (!global.db.data.warns) global.db.data.warns = {};
  if (!global.db.data.warns[userKey]) global.db.data.warns[userKey] = { count: 0, lastWarning: 0 };

  const userWarnings = global.db.data.warns[userKey];
  const now = Date.now();

  // Ignorar si el remitente es administrador, owner o el bot
  if (isAdmin || isOwner || m.sender === botNumber) return true;

  // Verificar si el mensaje contiene un enlace
  if (isLink.exec(m.text)) {
    if (!chat.antiLinks) return true; // Ignorar si el sistema anti-enlaces está desactivado

    // Incrementar el contador de advertencias
    userWarnings.count += 1;
    userWarnings.lastWarning = now;

    // Eliminar el mensaje del grupo
    await conn.sendMessage(m.chat, { delete: m.key });

    // Manejo de advertencias según la cantidad acumulada
    if (userWarnings.count === 1) {
      // Primera advertencia en privado
      await conn.reply(
        m.sender,
        `⚠️ **Primera Advertencia:** No está permitido enviar enlaces en este grupo. Si reincides, habrá consecuencias.`,
        null
      );
    } else if (userWarnings.count === 2) {
      // Segunda advertencia en privado
      await conn.reply(
        m.sender,
        `⚠️ **Segunda Advertencia:** Estás reincidiendo en enviar enlaces. Una más y serás eliminado del grupo.`,
        null
      );
    } else if (userWarnings.count >= 3) {
      // Tercera advertencia: expulsar usuario y notificar en privado
      await conn.reply(
        m.sender,
        `❌ **Expulsado:** Has sido eliminado del grupo por enviar enlaces en tres ocasiones.`,
        null
      );
      await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');

      // Reiniciar el contador de advertencias tras la expulsión
      delete global.db.data.warns[userKey];
    }
    return false; // Detener el procesamiento del mensaje
  }

  return true;
};

export default handler;

