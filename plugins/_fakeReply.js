import fetch from 'node-fetch'

export async function before(m, { conn }) {
let name = '⛄𝐓𝐊 𝐇𝐎𝐒𝐓 - 𝐁𝐎𝐓 𝐂𝐇𝐀𝐍𝐍𝐄𝐋🌲'
let imagenes = ["https://i.ibb.co/f9kvM3S/file.jpg",
"https://i.ibb.co/wCPxV2D/file.jpg",
"https://i.ibb.co/wCPxV2D/file.jpg",
"https://i.ibb.co/FDyNygX/file.jpg"]

let icono = imagenes[Math.floor(Math.random() * imagenes.length)]

//Enlaces
var canal =   'https://whatsapp.com/channel/0029Vakpp8h1Hsq5Y5kbF33t'
var git = 'https://github.com/WillZek'  
var github = 'https://github.com/WillZek/CrowBot-ST' 
var facebook = 'https://www.facebook.com/profile.php?id=100055985748040' 
let tiktok = 'https://tiktok.com/@the_crow_legendario_bs'
let correo = 'sm.ninopina10@gmail.com'

global.redes = [canal, git, github, facebook, tiktok, correo].getRandom()

global.rcanal = {
 contextInfo: {
             isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363233459118973@newsletter",
      serverMessageId: 100,
      newsletterName: name,
   }, 
   externalAdReply: {
    showAdAttribution: true, 
    title: botname, 
    body: textbot, 
    mediaUrl: null, 
    description: null, 
    previewType: "PHOTO", 
    thumbnailUrl: icono, 
    sourceUrl: canal, 
    mediaType: 1, 
    renderLargerThumbnail: false }, 
    }, 
    }


global.icono = [ 
'https://qu.ax/yyCo.jpeg',
'https://qu.ax/yyCo.jpeg',
'https://qu.ax/qJch.jpeg',
'https://qu.ax/qJch.jpeg',
'https://qu.ax/CHRS.jpeg',
'https://qu.ax/CHRS.jpeg',
].getRandom()

        global.fkontak = { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(m.chat ? { remoteJid: `status@broadcast` } : {}) }, message: { 'contactMessage': { 'displayName': wm, 'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:XL;${wm},;;;\nFN:${wm},\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabell:Ponsel\nEND:VCARD`, 'jpegThumbnail': fs.readFileSync('./storage/img/catalogo.png'), thumbnail: fs.readFileSync('./storage/img/catalogo.png'), sendEphemeral: true } } }

  // Respuesta con enlace de WhatsApp
  global.rpl = {
    contextInfo: {
      externalAdReply: {
        mediaUrl: group,
        mediaType: 'VIDEO',
        description: 'support group',
        title: packname,
        body: 'grupo de soporte',
        thumbnailUrl: imagen2,
        sourceUrl: group,
      }
    }
  };

 global.fake = {
    contextInfo: {
            isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363233459118973@newsletter",
      serverMessageId: 100,
      newsletterName: name,
    },
    },
  }
}