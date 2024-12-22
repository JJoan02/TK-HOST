let handler = async (m, { conn }) => {
  // Lista de URLs de imágenes
  const imageUrls = [
    'https://pomf2.lain.la/f/heo0hfu6.jpg',
    'https://pomf2.lain.la/f/9yxhgs9j.jpg',
    'https://pomf2.lain.la/f/nqwlpdur.jpg',
    'https://pomf2.lain.la/f/mjns9r6n.jpg',
    'https://pomf2.lain.la/f/9wsnri0p.jpg'
  ];

  // Seleccionar una URL de imagen al azar
  const randomImageUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)];

  // Lista de respuestas graciosas y promocionales
  const responses = [
    "💀 *TK-HOST sigue en pie*, así que no te emociones tanto. 😂",
    "🚀 *Estado actual*: servidores más vivos que tus ganas de estudiar. 😎",
    "🤖 *Servidor operativo*: ¡sigamos trabajando juntos! 💻",
    "🌐 *TK-HOST funcionando a full*, porque tus proyectos lo merecen. 🌟",
    "🛠️ *Mantenimiento impecable*: servidores listos para lo que necesites. ⚙️",
    "📡 *Conexión al 100%*: más estable que tu WiFi. 📶",
    "🎉 *Estamos activos*: porque TK-HOST nunca descansa. 🥳",
    "🔌 *Siempre conectados*: más rápidos que un Ferrari en la pista. 🚗💨",
    "📊 *Tu hosting, tu poder*: rendimiento optimizado para ti. 💪",
    "🔥 *Más caliente que nunca*: servidores listos para cualquier reto. 🔥",
    "💰 *Compra tus coins ahora*: ¡ofertas disponibles solo por tiempo limitado! 🤑",
    "🖥️ *Adquiere tu servidor*: lleva tus ideas al siguiente nivel. 🚀",
    "🎮 *Servidores gaming*: perfectos para tus batallas épicas. 🕹️",
    "📦 *Planes hechos para ti*: hosting diseñado para crecer contigo. 📈",
    "🔧 *Soporte 24/7*: porque en TK-HOST siempre estamos para ayudarte. 🛠️",
    "🏆 *Liderando en calidad*: tu proyecto merece lo mejor. 👑",
    "🛒 *Haz tu pedido ahora*: servidores listos en minutos. ⏳",
    "💎 *Calidad premium*: hosting que supera tus expectativas. 💎",
    "🌟 *Fácil y rápido*: configura todo desde donde estés. 📱",
    "📈 *Crece con nosotros*: hosting que impulsa tu negocio. 📊",
    "🔌 *Conexión sin límites*: lleva tu proyecto a lo más alto. ⚡",
    "💡 *Aprovecha nuestros consejos*: TK-HOST te guía paso a paso. 📚",
    "🔒 *Seguridad total*: protege lo que más importa con nosotros. 🔐",
    "🎯 *Servidor al instante*: clic y comienza tu proyecto. 🏹",
    "🌌 *Expande tus horizontes*: con TK-HOST, el límite es el cielo. 🌠",
    "🌍 *Global y confiable*: servidores que funcionan en todo el mundo. 🌐",
    "🤑 *Ofertas únicas*: consigue más por menos con TK-HOST. 💸",
    "👑 *Calidad garantizada*: servidores que hacen la diferencia. 🎖️",
    "📣 *Recomiéndanos y gana*: descuentos exclusivos para ti. 🎁",
    "📱 *Panel intuitivo*: administra tu servidor desde cualquier lugar. 📲",
    "🌟 *Planes personalizados*: porque cada proyecto es único. 🔧",
    "🔥 *Hosting sin igual*: la mejor elección para tus ideas. 🚀",
    "🎭 *Sin drama, solo resultados*: estabilidad garantizada. 🎯",
    "🛡️ *Protección avanzada*: porque tu seguridad es lo primero. ⚔️",
    "🎙️ *Siempre activos*: TK-HOST está aquí para ti, siempre. 🎧",
    "📡 *Estado impecable*: trabajando al máximo rendimiento. 📶",
    "⚡ *Optimización garantizada*: tu servidor, siempre a tope. 💥",
    "👾 *Perfecto para gamers*: rendimiento épico, sin excusas. 🕹️"
  ];

  // Seleccionar una respuesta al azar
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];

  // Mensaje combinado con la imagen
  const text = `
🔍 *Estado del Servicio* 📡

${randomResponse}

> Consulta aquí:
> https://dash.tk-joanhost.com/home
  `.trim();

  // Enviar la respuesta con la imagen seleccionada al azar
  await conn.sendFile(m.chat, randomImageUrl, 'estado.jpg', text, m);
};

handler.command = ['estado'];
handler.tags = ['estado'];
handler.help = ['estado'];
export default handler;



