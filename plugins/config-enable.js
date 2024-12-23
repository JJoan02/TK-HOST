import fetch from 'node-fetch'
import fs from 'fs'

/**
 * Handler principal para activar y desactivar distintas configuraciones
 * del bot tanto a nivel de grupo como a nivel global o de usuario.
 */
let handler = async (m, { conn, usedPrefix, command, args, isOwner, isAdmin, isROwner }) => {
  // Validar si el remitente está autorizado (bot, owner, ROwner, admin)
  if (m.sender !== conn.user.jid && !isOwner && !isROwner && !isAdmin) {
    // Si no es ninguno de los anteriores, ignoramos el comando
    return
  }

  // Lista de opciones de configuración con descripción
  const opciones = [
    { name: 'welcome', description: 'Activa o desactiva la bienvenida en el grupo.' },
    { name: 'antibots', description: 'Activa o descativa el antibots en el grupo.' },
    { name: 'restrict', description: 'Restringe comandos específicos solo a administradores.' },
    { name: 'antiTiktok', description: 'Bloquea enlaces de TikTok en el grupo.' },
    { name: 'antiYoutube', description: 'Bloquea enlaces de YouTube en el grupo.' },
    { name: 'autoaceptar', description: 'Acepta automáticamente a los nuevos miembros del grupo.' },
    { name: 'antiTelegram', description: 'Bloquea enlaces de Telegram en el grupo.' },
    { name: 'antiFacebook', description: 'Bloquea enlaces de Facebook en el grupo.' },
    { name: 'antiInstagram', description: 'Bloquea enlaces de Instagram en el grupo.' },
    { name: 'antiTwitter', description: 'Bloquea enlaces de Twitter en el grupo.' },
    { name: 'antiDiscord', description: 'Bloquea enlaces de Discord en el grupo.' },
    { name: 'antiver', description: 'Bloquea mensajes de "ver una vez".' },
    { name: 'modoadmin', description: 'Restringe acciones solo a administradores del grupo.' },
    { name: 'autolevelup', description: 'Activa el sistema de auto nivelación.' },
    { name: 'antispam', description: 'Bloquea mensajes repetitivos (spam).' },
    { name: 'antitoxic', description: 'Bloquea palabras tóxicas en el grupo.' },
    { name: 'nsfw', description: 'Permite comandos NSFW en el grupo.' },
    { name: 'antiarabes', description: 'Bloquea prefijos no latinos o árabes.' },
    { name: 'antilink', description: 'Bloquea enlaces en el grupo.' },
    { name: 'autoread', description: 'Activa la lectura automática de mensajes (solo Owner/ROwner).' },
    { name: 'document', description: 'Activa o desactiva el uso de documentos para el usuario.' },
  ]

  // Determina si se está activando (on/enable/1) o desactivando (off/disable/0)
  let isEnable = /true|enable|(turn)?on|1/i.test(command)

  // Referencias a la base de datos y configuración global
  let chat = global.db.data.chats[m.chat]
  let user = global.db.data.users[m.sender]
  let bot = global.db.data.settings[conn.user.jid] || {}

  // Opción solicitada (primer argumento en minúsculas)
  let type = (args[0] || '').toLowerCase()

  // Estas variables se usan para mostrar dónde se aplicó la configuración (GLOBAL / USUARIO / GRUPO)
  let isAll = false
  let isUser = false

  /**
   * Genera el menú con el estado (✅ / ❌) de cada opción.
   * Retorna un string listo para enviar al chat.
   */
  const generarMenu = () => {
    return opciones.map(opt => {
      let estado = '❌' // Valor por defecto
      switch (opt.name.toLowerCase()) {
        case 'welcome':
          estado = chat.bienvenida ? '✅' : '❌'
          break
        case 'antibots':
          estado = chat.antibots ? '✅' : '❌' // Asegúrate de usar ❌ o ✖️, pero sé consistente
          break
        case 'restrict':
          // Muestra el estado actual de `restrict` a nivel global
          estado = global.opts?.restrict ? '✅' : '❌'
          break
        case 'antitiktok':
          estado = chat.antiTiktok ? '✅' : '❌'
          break
        case 'antiyoutube':
          estado = chat.antiYoutube ? '✅' : '❌'
          break
        case 'autoaceptar':
          estado = chat.autoaceptar ? '✅' : '❌'
          break
        case 'antitelegram':
          estado = chat.antiTelegram ? '✅' : '❌'
          break
        case 'antifacebook':
          estado = chat.antiFacebook ? '✅' : '❌'
          break
        case 'antiinstagram':
          estado = chat.antiInstagram ? '✅' : '❌'
          break
        case 'antitwitter':
          estado = chat.antiTwitter ? '✅' : '❌'
          break
        case 'antidiscord':
          estado = chat.antiDiscord ? '✅' : '❌'
          break
        case 'antiver':
          estado = chat.antiver ? '✅' : '❌'
          break
        case 'modoadmin':
          estado = chat.modoadmin ? '✅' : '❌'
          break
        case 'autolevelup':
          estado = chat.autolevelup ? '✅' : '❌'
          break
        case 'antispam':
          // Se guarda en la parte global de settings
          estado = bot.antiSpam ? '✅' : '❌'
          break
        case 'antitoxic':
          estado = chat.antitoxic ? '✅' : '❌'
          break
        case 'nsfw':
          estado = chat.nsfw ? '✅' : '❌'
          break
        case 'antiarabes':
          estado = chat.onlyLatinos ? '✅' : '❌'
          break
        case 'antilink':
          estado = chat.antiLink ? '✅' : '❌'
          break
        case 'autoread':
          estado = global.opts?.autoread ? '✅' : '❌'
          break
        case 'document':
          estado = user.useDocument ? '✅' : '❌'
          break
      }
      return `✦ (${estado}) ${opt.name.toUpperCase()}\n     - ${opt.description}\n`
    }).join('\n')
  }

  // Estructura switch para manejar la lógica de activación/desactivación de cada opción
  switch (type) {
    case 'antibots':
    case 'antibot':  
      // Ajusta permisos según tu preferencia (aquí solo admin u owner)
      if (m.isGroup && !(isAdmin || isOwner)) {
        return conn.reply(m.chat, '❌ Solo administradores o el owner pueden cambiar esta configuración.', m)
      }
      chat.antibots = isEnable
      break

    case 'restrict':
      // Se aplica a nivel GLOBAL
      isAll = true
      if (!isROwner) {
        return conn.reply(m.chat, '❌ Solo el propietario principal (ROwner) puede cambiar esta configuración.', m)
      }
      // Activar o desactivar la restricción global
      global.opts.restrict = isEnable
      break

    case 'welcome':
      if (m.isGroup && !(isAdmin || isOwner)) {
        return conn.reply(m.chat, '❌ Solo administradores o el owner pueden cambiar esta configuración.', m)
      }
      chat.bienvenida = isEnable
      break

    case 'autolevelup':
      if (m.isGroup && !(isAdmin || isOwner)) {
        return conn.reply(m.chat, '❌ Solo administradores o el owner pueden cambiar esta configuración.', m)
      }
      chat.autolevelup = isEnable
      break

    case 'antilink':
      if (m.isGroup && !(isAdmin || isOwner)) {
        return conn.reply(m.chat, '❌ Solo administradores o el owner pueden cambiar esta configuración.', m)
      }
      chat.antiLink = isEnable
      break

    case 'antispam':
      // Se aplica a nivel GLOBAL
      isAll = true
      if (!isOwner) {
        return conn.reply(m.chat, '❌ Solo el propietario (Owner) puede cambiar esta configuración.', m)
      }
      bot.antiSpam = isEnable
      break

    case 'autoread':
      // Se aplica a nivel GLOBAL
      isAll = true
      if (!isROwner) {
        return conn.reply(m.chat, '❌ Solo el propietario principal (ROwner) puede cambiar esta configuración.', m)
      }
      // Activar/desactivar lectura automática en global.opts
      global.opts.autoread = isEnable
      break

    case 'document':
      // Se aplica a nivel de usuario
      isUser = true
      user.useDocument = isEnable
      break

    case 'antitiktok':
      if (m.isGroup && !(isAdmin || isOwner)) {
        return conn.reply(m.chat, '❌ Solo administradores o el owner pueden cambiar esta configuración.', m)
      }
      chat.antiTiktok = isEnable
      break

    case 'antiyoutube':
      if (m.isGroup && !(isAdmin || isOwner)) {
        return conn.reply(m.chat, '❌ Solo administradores o el owner pueden cambiar esta configuración.', m)
      }
      chat.antiYoutube = isEnable
      break

    case 'antitelegram':
      if (m.isGroup && !(isAdmin || isOwner)) {
        return conn.reply(m.chat, '❌ Solo administradores o el owner pueden cambiar esta configuración.', m)
      }
      chat.antiTelegram = isEnable
      break

    case 'antifacebook':
      if (m.isGroup && !(isAdmin || isOwner)) {
        return conn.reply(m.chat, '❌ Solo administradores o el owner pueden cambiar esta configuración.', m)
      }
      chat.antiFacebook = isEnable
      break

    case 'antiinstagram':
      if (m.isGroup && !(isAdmin || isOwner)) {
        return conn.reply(m.chat, '❌ Solo administradores o el owner pueden cambiar esta configuración.', m)
      }
      chat.antiInstagram = isEnable
      break

    case 'antitwitter':
      if (m.isGroup && !(isAdmin || isOwner)) {
        return conn.reply(m.chat, '❌ Solo administradores o el owner pueden cambiar esta configuración.', m)
      }
      chat.antiTwitter = isEnable
      break

    case 'antidiscord':
      if (m.isGroup && !(isAdmin || isOwner)) {
        return conn.reply(m.chat, '❌ Solo administradores o el owner pueden cambiar esta configuración.', m)
      }
      chat.antiDiscord = isEnable
      break

    case 'antiver':
      if (m.isGroup && !(isAdmin || isOwner)) {
        return conn.reply(m.chat, '❌ Solo administradores o el owner pueden cambiar esta configuración.', m)
      }
      chat.antiver = isEnable
      break

    case 'modoadmin':
      if (m.isGroup && !(isAdmin || isOwner)) {
        return conn.reply(m.chat, '❌ Solo administradores o el owner pueden cambiar esta configuración.', m)
      }
      chat.modoadmin = isEnable
      break

    case 'antitoxic':
      if (m.isGroup && !(isAdmin || isOwner)) {
        return conn.reply(m.chat, '❌ Solo administradores o el owner pueden cambiar esta configuración.', m)
      }
      chat.antitoxic = isEnable
      break

    case 'nsfw':
    case '+18':  
      if (m.isGroup && !(isAdmin || isOwner)) {
        return conn.reply(m.chat, '❌ Solo administradores o el owner pueden cambiar esta configuración.', m)
      }
      chat.nsfw = isEnable
      break

    case 'antiarabes':
      if (m.isGroup && !(isAdmin || isOwner)) {
        return conn.reply(m.chat, '❌ Solo administradores o el owner pueden cambiar esta configuración.', m)
      }
      chat.onlyLatinos = isEnable
      break

    case 'autoaceptar':
    case 'aceptarnuevos':
      // Activar o desactivar la aceptación automática de nuevos miembros en el grupo
      if (m.isGroup && !(isAdmin || isOwner)) {
        return conn.reply(m.chat, '❌ Solo administradores o el owner pueden cambiar esta configuración.', m)
      }
      chat.autoaceptar = isEnable
      break

    default:
      // Si el usuario no especifica una opción válida, mostramos el menú
      if (!/[01]/.test(command)) {
        return conn.reply(
          m.chat,
          `🤖 *Opciones disponibles:*\n\n${generarMenu()}\n` +
            `📌 Usa *${usedPrefix}on <opción>* para activar o *${usedPrefix}off <opción>* para desactivar.\n` +
            `📌 Ejemplo: *${usedPrefix}on antibots*`,
          m
        )
      }
      throw false
  }

  // Si todo fue bien, avisamos cuál es la configuración que se cambió
  await conn.reply(
    m.chat,
    `✅ *Configuración actualizada:*\n\n` +
    `✦ Opción: *${type.toUpperCase()}*\n` +
    `✦ Estado: *${isEnable ? 'ACTIVADO' : 'DESACTIVADO'}*\n` +
    `✦ Aplicado: ${
      isAll
        ? 'GLOBAL'
        : isUser
          ? 'USUARIO'
          : 'GRUPO'
    }`,
    m
  )
}

// Ayuda, etiquetas y comandos para acceder a esta funcionalidad
handler.help = ['enable', 'disable']
handler.tags = ['settings']
handler.command = /^(enable|disable|on|off|1|0)$/i

export default handler


