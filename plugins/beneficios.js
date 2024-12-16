let handler = async (m, { conn }) => {
  const imageUrl = 'https://example.com/beneficios.jpg'; // URL de la imagen
  const text = `
✨ *Beneficios de TK-Host* 🌟
Con nuestros servicios, obtienes:

🔹 Servidores optimizados para bots de WhatsApp.
🔹 Soporte técnico 24/7.
🔹 Backups automáticos y configuraciones personalizadas.
🔹 Escalabilidad para proyectos en crecimiento.

🌐 Más detalles en [Beneficios TK-Host](https://tk-host.com/beneficios).

💻 ¡Lleva tu bot al siguiente nivel! 🚀
  `.trim();
  await conn.sendFile(m.chat, imageUrl, 'beneficios.jpg', text, m);
};
handler.command = ['beneficios'];
handler.tags = ['beneficios'];
handler.help = ['beneficios'];
export default handler;
