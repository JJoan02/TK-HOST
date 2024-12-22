import fetch from 'node-fetch';
import fs from 'fs';

let handler = async (m, { conn }) => {
  // URLs de imágenes
  const imageUrls = [
    'https://pomf2.lain.la/f/heo0hfu6.jpg',
    'https://pomf2.lain.la/f/9yxhgs9j.jpg',
    'https://pomf2.lain.la/f/nqwlpdur.jpg',
    'https://pomf2.lain.la/f/mjns9r6n.jpg',
    'https://pomf2.lain.la/f/9wsnri0p.jpg',
  ];
  const randomImageUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)];

  // Frases aleatorias
  const responses = [
    "💻 TK-HOST: Tu servicio de hosting confiable y eficiente.",
    "⚡ Servidores ultrarrápidos para potenciar tus proyectos.",
    "🤖 Bot de WhatsApp integrado para gestionar tus clientes al instante.",
    "🎮 Servidores Minecraft estables y sin lag para tus comunidades.",
    "📜 Lista de prebots optimizada para desarrolladores exigentes.",
  ];
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];

  // Formato del texto
  const text = `
✦━── ──━✦ E-S-T-A-D-O ✦━── ──━✦

🔍 Estado del Servicio 📡
${randomResponse}

> Consulta aquí:
> https://dash.tk-joanhost.com/home
`.trim();

  // Opciones de rcanal
  const rcanal = {
    contextInfo: {
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: "120363314192605628@newsletter",
        serverMessageId: 100,
        newsletterName: 'Tk-Host Channel',
      },
      externalAdReply: {
        showAdAttribution: true,
        title: 'Estado del Servicio',
        body: 'TK-HOST | Tu aliado digital',
        mediaUrl: null,
        description: null,
        previewType: "PHOTO",
        thumbnailUrl: randomImageUrl, // Imagen seleccionada aleatoriamente
        sourceUrl: 'https://dash.tk-joanhost.com/home',
        mediaType: 1,
        renderLargerThumbnail: true,
      },
    },
  };

  // Enviar el mensaje con rcanal
  await conn.sendMessage(m.chat, { text, ...rcanal }, { quoted: m });
};

handler.command = ['estado'];
handler.tags = ['estado'];
handler.help = ['estado'];
export default handler;

