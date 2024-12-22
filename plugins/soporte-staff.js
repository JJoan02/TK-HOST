let handler = async (m, { conn, participants, groupMetadata, args }) => {
  const imageUrl = 'https://pomf2.lain.la/f/9a79fsqu.jpg'; // Cambia por la URL de la imagen adecuada

  // Obtener los administradores del grupo
  const groupAdmins = participants.filter(p => p.admin);
  if (groupAdmins.length === 0) return m.reply('No hay administradores en este grupo.');

  // Formatear el número de WhatsApp con espacios
  const formatPhoneNumber = number => {
    return number.replace(/(\d{2})(\d{3})(\d{3})(\d{3})/, '+$1 $2 $3 $4');
  };

  // Crear la lista de administradores con formato adecuado
  const listAdmin = groupAdmins.map((v, i) => {
    const number = formatPhoneNumber(v.id.split('@')[0]); // Número formateado
    const name = conn.getName(v.id) || 'Sin Nombre'; // Nombre del administrador
    return `*${i + 1}.* ${number} (${name})`;
  }).join('\n');

  // Obtener el propietario del grupo
  const ownerId = groupMetadata.owner || groupAdmins.find(p => p.admin === 'superadmin')?.id || '';
  const ownerNumber = ownerId ? formatPhoneNumber(ownerId.split('@')[0]) : 'No disponible';
  const ownerName = ownerId ? conn.getName(ownerId) || 'Sin Nombre' : 'No disponible';

  // Mensaje estructurado
  const text = `
🌟 *Staff del Grupo* 🌟

👑 *Propietario del Grupo*  
- ${ownerName} (${ownerNumber})

👥 *Administradores*  
${listAdmin}

🛠️ *Soporte Técnico* 👩‍💻  
¿Problemas o preguntas? Nuestro equipo está listo para ayudarte:

📩 Email: joanbottk@gmail.com  
📞 WhatsApp: +51 910 234 457  
🌐 Pagina Oficial
> https://dash.tk-joanhost.com/home

✨ ¡Tu éxito es nuestra prioridad! 💪
  `.trim();

  // Enviar la imagen junto con el mensaje utilizando rcanal
  await conn.sendAi(m.chat, titulowm2, titu, text, imageUrl, imageUrl, canal, estilo);
};

handler.command = /^(staff|adminslist)$/i; // Comandos activadores
handler.tags = ['soporte', 'admins'];
handler.help = ['staff', 'adminslist'];
handler.group = true; // Solo en grupos
export default handler;
