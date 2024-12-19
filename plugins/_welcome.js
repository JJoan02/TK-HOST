import { WAMessageStubType } from '@whiskeysockets/baileys';
import fetch from 'node-fetch';

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return !0;

  // Detecta solo eventos de entrada (27)
  if (m.messageStubType == 27) {
    // Obtención de la foto de perfil
    let pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image').catch(_ => 'https://pomf2.lain.la/f/fr4b8stz.jpg');
    let img = await (await fetch(`${pp}`)).buffer();

    let chat = global.db.data.chats[m.chat];
    
    if (chat.bienvenida) {
      let welcome = `*✦━── ──━✦ \`ʙɪᴇɴᴠᴇɴɪᴅᴀ\` ✦━── ──━✦*\n\n╭── • ✧ • ✧ • ✧ • ✧ • ✧ •\n│ ✦ ᴡᴇʟᴄᴏᴍᴇ: @${m.messageStubParameters[0].split`@`[0]}\n│ ✦ ɢʀᴜᴘᴏ: *${groupMetadata.subject}*    \n╰── • ✧ • ✧ • ✧ • ✧ • ✧ •\n\n> Lee la descripción del grupo\n> ¿Quieres comprar un servidor?`;
      await conn.sendAi(m.chat, titulowm2, titu, welcome, img, img, canal, estilo);
    }
  }
}
