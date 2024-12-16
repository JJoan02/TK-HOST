let handler = async (m, { conn }) => {
  const imageUrl = 'https://example.com/faqs.jpg'; // URL de la imagen
  const text = `
❓ *Preguntas Frecuentes (FAQs)* 💬
Resuelve tus dudas rápidamente en nuestra sección de FAQs:

🌐 [FAQs TK-Host](https://tk-host.com/faqs)

💡 ¿No encuentras lo que buscas? Escríbenos, ¡estamos aquí para ti! 😊
  `.trim();
  await conn.sendFile(m.chat, imageUrl, 'faqs.jpg', text, m);
};
handler.command = ['faqs'];
handler.tags = ['faqs'];
handler.help = ['faqs'];
export default handler;
