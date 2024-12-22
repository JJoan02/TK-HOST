import fetch from 'node-fetch';

const linkRegex = {
  tiktok: /tiktok\.com/i,
  youtube: /youtube\.com|youtu\.be/i,
  telegram: /telegram\.com/i,
  facebook: /facebook\.com|fb\.me/i,
  instagram: /instagram\.com/i,
  twitter: /twitter\.com/i,
  any: /(https?:\/\/[^\s]+)/i
};

let handler = m => m;

handler.before = async function (m, { conn, isAdmin, isBotAdmin, isOwner }) {
  if (!m.isGroup) return false; // Solo aplica en grupos
  if (m.isBaileys && m.fromMe) return true; // Ignorar mensajes enviados por el bot

  const chat = global.db.data.chats[m.chat];
  const botSettings = global.db.data.settings[this.user.jid] || {};
  const senderNumber = m.sender.split('@')[0];
  const userKey = `${m.chat}-${m.sender}`;

  // Inicializar advertencias si no existen
  if (!global.db.data.warns) global.db.data.warns = {};
  if (!global.db.data.warns[userKey]) global.db.data.warns[userKey] = { count: 0, lastWarning: 0 };

  const userWarnings = global.db.data.warns[userKey];
  const now = Date.now();

  // Ignorar si el remitente es administrador, owner o el bot
  if (isAdmin || isOwner || m.sender === this.user.jid) return true;

  // Verificar si el mensaje contiene enlaces
  for (const [key, regex] of Object.entries(linkRegex)) {
    if (regex.exec(m.text)) {
      if (!chat[`anti${key.charAt(0).toUpperCase() + key.slice(1)}`]) return true; // Ignorar si el sistema anti-enlaces específico está desactivado

      // Incrementar el contador de advertencias
      userWarnings.count += 1;
      userWarnings.lastWarning = now;

      // Eliminar el mensaje del grupo
      await conn.sendMessage(m.chat, { delete: m.key });

      // Manejo de advertencias según la cantidad acumulada
      if (userWarnings.count === 1) {
        await conn.reply(
          m.sender,
          `⚠️ **Primera Advertencia:** No está permitido enviar enlaces (${key}) en este grupo. Si reincides, habrá consecuencias.`,
          null
        );
      } else if (userWarnings.count === 2) {
        await conn.reply(
          m.sender,
          `⚠️ **Segunda Advertencia:** Estás reincidiendo en enviar enlaces (${key}). Una más y serás eliminado del grupo.`,
          null
        );
      } else if (userWarnings.count >= 3) {
        await conn.reply(
          m.sender,
          `❌ **Expulsado:** Has sido eliminado del grupo por enviar enlaces (${key}) en tres ocasiones.`,
          null
        );
        await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
        delete global.db.data.warns[userKey];
      }
      return false; // Detener el procesamiento del mensaje
    }
  }

  return true;
};

export default handler;
