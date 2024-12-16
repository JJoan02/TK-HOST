import { WAMessageStubType } from '@whiskeysockets/baileys';
import PhoneNumber from 'awesome-phonenumber';
import chalk from 'chalk';
import { watchFile } from 'fs';
import '../config.js';

const terminalImage = global.opts['img'] ? require('terminal-image') : '';
const urlRegex = (await import('url-regex-safe')).default({ strict: false });

export default async function (m, conn = { user: {} }) {
  try {
    // Información básica del mensaje
    const _name = await conn.getName(m.sender);
    const sender = formatPhoneNumber(m.sender, _name);
    const chat = await conn.getName(m.chat);
    let img;

    // Descargar imagen o video si es aplicable
    try {
      if (global.opts['img'] && /sticker|image|video|status/gi.test(m.mtype)) {
        img = await terminalImage.buffer(await m.download());
      }
    } catch (e) {
      console.error(chalk.red(`⚠️ Error descargando imagen/video: ${e.message}`));
    }

    // Calcular tamaño del mensaje
    const filesize = calculateFileSize(m);
    const botName = conn.user?.name || 'Desconocido';

    // Crear el encabezado del log
    const logHeader = `
╭━━━━━━━━━━━━━━𖡼
┃ ❖ Bot: ${chalk.cyan.bold(botName)}
┃ ❖ Remitente: ${chalk.white.bold(sender)}
┃ ❖ Chat: ${chat ? chalk.magentaBright(chat) : chalk.greenBright('Privado')}
┃ ❖ Tamaño del mensaje: ${chalk.yellow(`${filesize} bytes`)}
┃ ❖ Tipo de mensaje: ${chalk.bgBlueBright.bold(await formatMessageTypes(m.mtype, m))}
╰━━━━━━━━━━━━━━𖡼
    `.trim();

    console.log(logHeader);

    if (img) console.log(`🖼️ Imagen/video descargado:\n${img.trimEnd()}`);

    if (typeof m.text === 'string' && m.text) {
      const formattedText = formatTextWithMarkdown(m.text, conn, m.mentionedJid);
      console.log(formattedText);
    }

    handleSpecificContentTypes(m);

    console.log(); // Espaciado final
  } catch (error) {
    console.error(chalk.red(`⚠️ Error procesando mensaje: ${error.message}`));
  }
}

// Función para formatear números de teléfono
function formatPhoneNumber(jid, name) {
  const phone = PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international');
  return phone + (name ? ` ~${name}` : '');
}

// Función para calcular tamaño del mensaje
function calculateFileSize(m) {
  return (
    (m.msg?.vcard?.length ||
      m.msg?.fileLength?.low ||
      m.msg?.fileLength ||
      m.msg?.axolotlSenderKeyDistributionMessage?.length ||
      m.text?.length ||
      0) || 0
  );
}

// Función para manejar tipos de mensajes
async function formatMessageTypes(mtype, m) {
  const types = {
    conversation: 'Texto simple',
    extendedTextMessage: 'Texto extendido',
    imageMessage: 'Imagen',
    videoMessage: 'Video',
    documentMessage: 'Documento',
    audioMessage: 'Audio',
    stickerMessage: 'Sticker',
    buttonsMessage: 'Botones',
    buttonsResponseMessage: 'Respuesta de botones',
    status: 'Estado',
  };

  if (m.isStatus) return 'Estado (Status)'; // Detectar explícitamente los estados
  return types[mtype] || 'Desconocido';
}

// Función para manejar texto con Markdown
function formatTextWithMarkdown(text, conn, mentionedJid = []) {
  let log = text.replace(/\u200e+/g, '');
  const mdRegex = /(?<=(?:^|[\s\n])\S?)(?:([*_~])(.+?)\1|```((?:.||[\n\r])+?)```)(?=\S?(?:[\s\n]|$))/g;
  log = log.replace(mdRegex, (_, type, content) => {
    const styles = { _: 'italic', '*': 'bold', '~': 'strikethrough' };
    return chalk[styles[type] || ''](content);
  });
  log = log.replace(urlRegex, (url) => chalk.blueBright(url));
  mentionedJid.forEach((jid) => {
    log = log.replace('@' + jid.split`@`[0], chalk.blueBright('@' + conn.getName(jid)));
  });
  return log;
}

// Función para manejar tipos de contenido específicos
function handleSpecificContentTypes(m) {
  if (/document/i.test(m.mtype)) console.log(`📄 Documento: ${m.msg.fileName || 'Sin nombre'}`);
  else if (/ContactsArray/i.test(m.mtype)) console.log(`👨‍👩‍👧‍👦 Contactos enviados.`);
  else if (/contact/i.test(m.mtype)) console.log(`👤 Contacto: ${m.msg.displayName || 'Sin nombre'}`);
  else if (/audio/i.test(m.mtype)) {
    const duration = m.msg.seconds;
    console.log(`🎵 Audio ${m.msg.ptt ? '(PTT)' : ''}: ${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}`);
  }
}

// Vigilar cambios en el archivo
const file = global.__filename(import.meta.url);
watchFile(file, () => {
  console.log(chalk.redBright("🔄 Archivo actualizado."));
});
