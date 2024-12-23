import fetch from 'node-fetch'
import fs from 'fs'

let handler = async (m, { conn, usedPrefix, command, args, isOwner, isAdmin, isROwner }) => {
  
  // Verificamos si NO es el bot, ni el owner, ni ROwner, ni un administrador
  // Si no cumple estas condiciones, se ignora el comando
  if (m.sender !== conn.user.jid && !isOwner && !isROwner && !isAdmin) {
    return
  }
  
  const opciones = [
    { name: 'welcome', description: 'Activa o desactiva la bienvenida en el grupo.' },
    { name: 'restrict', description: 'Restringe comandos específicos solo a administradores.' },
    { name: 'antiTiktok', description: 'Bloquea enlaces de TikTok en el grupo.' },
    { name: 'antiYoutube', description: 'Bloquea enlaces de YouTube en el grupo.' },
    { name: 'autoaceptar', description: 'Acepta A Los Miembros Del Grupo' },
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
    { name: 'antiarabes', description: 'Bloquea mensajes de usuarios árabes o con caracteres no latinos.' },
    { name: 'antilink', description: 'Bloquea enlaces en el grupo.' },
    { name: 'autoread', description: 'Activa la lectura automática de mensajes (solo Owner).' },
    { name: 'document', description: 'Activa o desactiva el uso de documentos para el usuario.' },
  ]

  let isEnable = /true|enable|(turn)?on|1/i.test(command)
  let chat = global.db.data.chats[m.chat]
  let user = global.db.data.users[m.sender]
  let bot = global.db.data.settings[conn.user.jid] || {}
  let type = (args[0] || '').toLowerCase()
  let isAll = false, isUser = false

  const generarMenu = () => {
    return opciones.map(opt => {
      let estado = '❌'
      switch (opt.name.toLowerCase()) {
        case 'welcome':
          estado = chat.bienvenida ? '✅' : '❌'
          break
        case 'restrict':
          estado = global.opts['restrict'] ? '✅' : '❌'
          break
        case 'antitiktok':
          estado = chat.antiTiktok ? '✅' : '❌'
          break
        case 'autoaceptar':
          estado = chat.autoaceptar ? '✅' : '❌'
          break
        case 'antiyoutube':
          estado = chat.antiYoutube ? '✅' : '❌'
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
          estado = global.opts['autoread'] ? '✅' : '❌'
          break
        case 'document':
          estado = user.useDocument ? '✅' : '❌'
          break
      }
      return `✦ (${estado}) ${opt.name.toUpperCase()}\n     - ${opt.description}\n`
    }).join('\n')
  }

  switch (type) {
    case 'restrict':
      isAll = true
      if (!isROwner) {
        return conn.reply(m.chat, '❌ Solo el propietario principal puede cambiar esta configuración.', m)
      }
      global.opts['restrict'] = isEnable
      break

    case 'welcome':
      if (m.isGroup && !(isAdmin || isOwner)) {
        return conn.reply(m.chat, '❌ Solo administradores pueden cambiar esta configuración.', m)
      }
      chat.bienvenida = isEnable
      break

    case 'autolevelup':
      if (m.isGroup && !(isAdmin || isOwner)) {
        return conn.reply(m.chat, '❌ Solo administradores pueden cambiar esta configuración.', m)
      }
      chat.autolevelup = isEnable
      break

    case 'antilink':
      if (m.isGroup && !(isAdmin || isOwner)) {
        return conn.reply(m.chat, '❌ Solo administradores pueden cambiar esta configuración.', m)
      }
      chat.antiLink = isEnable
      break

    case 'antispam':
      isAll = true
      if (!isOwner) {
        return conn.reply(m.chat, '❌ Solo el propietario puede cambiar esta configuración.', m)
      }
      bot.antiSpam = isEnable
      break

    case 'autoread':
      isAll = true
      if (!isROwner) {
        return conn.reply(m.chat, '❌ Solo el Propietario Principal (ROwner) puede cambiar esta configuración.', m)
      }
      global.opts['autoread'] = isEnable
      break

    case 'document':
      isUser = true
      user.useDocument = isEnable
      break

    case 'antitiktok':
      if (m.isGroup && !(isAdmin || isOwner)) {
        return conn.reply(m.chat, '❌ Solo administradores pueden cambiar esta configuración.', m)
      }
      chat.antiTiktok = isEnable
      break

    case 'antiyoutube':
      if (m.isGroup && !(isAdmin || isOwner)) {
        return conn.reply(m.chat, '❌ Solo administradores pueden cambiar esta configuración.', m)
      }
      chat.antiYoutube = isEnable
      break

    case 'antitelegram':
      if (m.isGroup && !(isAdmin || isOwner)) {
        return conn.reply(m.chat, '❌ Solo administradores pueden cambiar esta configuración.', m)
      }
      chat.antiTelegram = isEnable
      break

    case 'antifacebook':
      if (m.isGroup && !(isAdmin || isOwner)) {
        return conn.reply(m.chat, '❌ Solo administradores pueden cambiar esta configuración.', m)
      }
      chat.antiFacebook = isEnable
      break

    case 'antiinstagram':
      if (m.isGroup && !(isAdmin || isOwner)) {
        return conn.reply(m.chat, '❌ Solo administradores pueden cambiar esta configuración.', m)
      }
      chat.antiInstagram = isEnable
      break

    case 'antitwitter':
      if (m.isGroup && !(isAdmin || isOwner)) {
        return conn.reply(m.chat, '❌ Solo administradores pueden cambiar esta configuración.', m)
      }
      chat.antiTwitter = isEnable
      break

    case 'antidiscord':
      if (m.isGroup && !(isAdmin || isOwner)) {
        return conn.reply(m.chat, '❌ Solo administradores pueden cambiar esta configuración.', m)
      }
      chat.antiDiscord = isEnable
      break

    case 'antiver':
      if (m.isGroup && !(isAdmin || isOwner)) {
        return conn.reply(m.chat, '❌ Solo administradores pueden cambiar esta configuración.', m)
      }
      chat.antiver = isEnable
      break

    case 'modoadmin':
      if (m.isGroup && !(isAdmin || isOwner)) {
        return conn.reply(m.chat, '❌ Solo administradores pueden cambiar esta configuración.', m)
      }
      chat.modoadmin = isEnable
      break

    case 'antitoxic':
      if (m.isGroup && !(isAdmin || isOwner)) {
        return conn.reply(m.chat, '❌ Solo administradores pueden cambiar esta configuración.', m)
      }
      chat.antitoxic = isEnable
      break

    case 'nsfw':
      if (m.isGroup && !(isAdmin || isOwner)) {
        return conn.reply(m.chat, '❌ Solo administradores pueden cambiar esta configuración.', m)
      }
      chat.nsfw = isEnable
      break

    case 'antiarabes':
      if (m.isGroup && !(isAdmin || isOwner)) {
        return conn.reply(m.chat, '❌ Solo administradores pueden cambiar esta configuración.', m)
      }
      chat.onlyLatinos = isEnable
      break

    case 'autoaceptar': case 'aceptarnuevos':
      if (m.isGroup && !(isAdmin || isOwner)) {
        return conn.reply(m.chat, '❌ Solo administradores pueden cambiar esta configuración.', m)
      }
      chat.autoaceptar = isEnable
      break    

if (!m.isGroup) {
if (!isOwner) {
global.dfail('group', m, conn)
throw false
}
} else if (!isAdmin) {
global.dfail('admin', m, conn)
throw false
}
chat.autoAceptar = isEnable
break

    default:
      if (!/[01]/.test(command)) {
        return conn.reply(
          m.chat, 
          `🤖 *Opciones disponibles:*\n\n${generarMenu()}\n\n` +
          `📌 Usa *${usedPrefix}on <opción>* para activar o *${usedPrefix}off <opción>* para desactivar.`,
          m
        )
      }
      throw false
  }

  await conn.reply(
    m.chat,
    `✅ *Configuración actualizada:*\n\n` +
    `✦ Opción: *${type.toUpperCase()}*\n` +
    `✦ Estado: *${isEnable ? 'ACTIVADO' : 'DESACTIVADO'}*\n` +
    `✦ Aplicado: ${isAll ? 'GLOBAL' : isUser ? 'USUARIO' : 'GRUPO'}`,
    m
  )
}

handler.help = ['enable', 'disable']
handler.tags = ['settings']
handler.command = /^(enable|disable|on|off|1|0)$/i

export default handler
