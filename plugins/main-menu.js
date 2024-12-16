import { promises } from 'fs';
import { join } from 'path';
import { xpRange } from '../lib/levelling.js';
import moment from 'moment-timezone';
import os from 'os';

const { generateWAMessageFromContent, proto, getDevice } = (await import('@whiskeysockets/baileys')).default;

// Función ucapan para generar saludos dinámicos según la hora
function ucapan() {
  const hour = parseInt(moment.tz('America/Lima').format('HH'), 10); // Asegúrate de convertir la hora a un número entero
  const greetings = [
    "Medianoche, los sueños de servidores se cumplen en TK-Host 🌠✨.", // 00
    "¡Es la 1 AM! Perfecto para soñar con comprar servidores en TK-Host 🖥️💤.", // 01
    "Son las 2 AM, hora ideal para planear proyectos con TK-Host 🌌.", // 02
    "A las 3 AM, los genios trabajan en sus servidores TK-Host 💡⚙️.", // 03
    "¡4 AM! El café y los servidores TK-Host son la pareja ideal ☕💻.", // 04
    "5 AM, despierta y domina el mundo con TK-Host 🌄🌍.", // 05
    "¡Buenos días! A las 6 AM, el futuro se construye en TK-Host ☀️📊.", // 06
    "Son las 7 AM, tiempo de éxito con TK-Host 🕖🚀.", // 07
    "A las 8 AM, la productividad sube con servidores TK-Host 🖥️📈.", // 08
    "¡9 AM! Todo es mejor con TK-Host y un buen desayuno 🥐☕.", // 09
    "A las 10 AM, los líderes optimizan sus servidores con TK-Host 🛠️.", // 10
    "Son las 11 AM, trabaja más rápido con TK-Host 💨💼.", // 11
    "¡Mediodía! Haz de tu negocio un éxito con TK-Host 🍽️💻.", // 12
    "1 PM, la hora del crecimiento con TK-Host 📈✨.", // 13
    "2 PM, potencia tus ideas con servidores TK-Host ⚡💡.", // 14
    "¡3 PM! Los expertos eligen TK-Host para innovar 🚀🌟.", // 15
    "4 PM, optimiza tu tiempo y tus proyectos con TK-Host ⏳🖥️.", // 16
    "A las 5 PM, los visionarios usan TK-Host 🌇💻.", // 17
    "6 PM, prepárate para un futuro brillante con TK-Host 🌅✨.", // 18
    "Son las 7 PM, ¡tu éxito comienza con TK-Host! 🌃🚀.", // 19
    "8 PM, el momento perfecto para escalar tus proyectos con TK-Host 🌌📊.", // 20
    "¡9 PM! La tranquilidad de tener TK-Host no tiene precio 🛌💻.", // 21
    "10 PM, ¿servidores rápidos? Solo en TK-Host 🖥️⚡.", // 22
    "A las 11 PM, despídete del estrés con TK-Host y duerme tranquilo 🌙💤." // 23
  ];
  return greetings[hour] || "¡Hora desconocida! Pero siempre es buen momento para TK-Host 🖥️.";
}

// Configuración del menú
const defaultMenu = {
  before: `*${ucapan()} \`%name\`*

🕒 Tiempo de actividad: _%muptime_
👥 Potenciales Clientes: _%nonregusers_

▬▭▬▭▬▭▬▭▬▭▬▭▬▭▬
💻 *TK-Host*
Servicios de Hosting para Bots 🌐
  `.trim(),
  header: '\n≋ %category ≋\n',
  body: '> %cmd\n',
  footer: '',
  after: `\n💻 *Rapidez, confiabilidad y diversión.* 🚀✨`,
};

// Función principal del menú
let handler = async (m, { conn, usedPrefix: _p }) => {
  let tags = {
    'pagina-panel': '🌐 Página y Panel',
    'precios': '💰 Precios y Tarifas',
    'planes': '📦 Planes Disponibles',
    'soporte': '🛠️ Soporte Técnico',
    'promociones': '🎉 Promociones Actuales',
    'estado': '🔍 Estado del Servicio',
  };

  try {
    // Datos del usuario y sistema
    const { exp, level } = global.db.data.users[m.sender] || {};
    const { min, xp, max } = xpRange(level, global.multiplier);
    const name = await conn.getName(m.sender);
    const totalreg = Object.keys(global.db.data.users).length;
    const nonregusers = totalreg - Object.values(global.db.data.users).filter(user => user.registered).length;
    const muptime = clockString(process.uptime() * 1000);

    // Generar texto del menú
    let text = [
      defaultMenu.before
        .replace(/%name/g, name || 'Usuario')
        .replace(/%muptime/g, muptime)
        .replace(/%nonregusers/g, nonregusers),
      Object.keys(tags)
        .map(tag => {
          let categoryHeader = defaultMenu.header.replace(/%category/g, tags[tag]);
          let categoryCommands = Object.values(global.plugins)
            .filter(plugin => plugin.tags?.includes(tag) && plugin.help)
            .map(plugin => plugin.help)
            .flat()
            .map(cmd => defaultMenu.body.replace(/%cmd/g, `${_p}${cmd}`))
            .join(''); // Sin saltos entre comandos
          return `${categoryHeader}${categoryCommands}`; // Sin salto entre encabezado y comandos
        })
        .join(''), // Sin saltos entre categorías
      defaultMenu.after,
    ].join('\n'); // Salto adicional solo al final

    // Imagen del menú
    let img = 'https://pomf2.lain.la/f/1kymodfa.jpg';
    await conn.sendFile(m.chat, img, 'menu.jpg', text.trim(), m);
  } catch (e) {
    console.error(e);
    m.reply(`🚨 *Error*: No se pudo generar el menú.\nPor favor, revisa los logs para más detalles.`);
  }
};

handler.help = ['menu'];
handler.tags = ['main'];
handler.command = /^(menu|menú|\?)$/i;

export default handler;

// Función auxiliar para formatear tiempo
function clockString(ms) {
  let h = Math.floor(ms / 3600000) % 24;
  let m = Math.floor(ms / 60000) % 60;
  let s = Math.floor(ms / 1000) % 60;
  return [h, ' H ', m, ' M ', s, ' S'].join('');
}
