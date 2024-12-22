import fetch from 'node-fetch'
import fs from 'fs'

let handler = async (m, { conn }) => {
  // 1) URLs de imágenes (puedes cambiarlas, borrar o agregar más)
  const imageUrls = [
    'https://pomf2.lain.la/f/heo0hfu6.jpg',
    'https://pomf2.lain.la/f/9yxhgs9j.jpg',
    'https://pomf2.lain.la/f/nqwlpdur.jpg',
    'https://pomf2.lain.la/f/mjns9r6n.jpg',
    'https://pomf2.lain.la/f/9wsnri0p.jpg'
  ]
  // Selección de imagen al azar
  const randomImageUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)]

  // 2) Canales de WhatsApp
  const canales = [
    'https://whatsapp.com/channel/0029VaS4zeE72WTyg5et571r',
    'https://whatsapp.com/channel/0029VaGGynJLY6d43krQYR2g'
  ]
  // Selección de canal al azar
  const randomCanal = canales[Math.floor(Math.random() * canales.length)]

  // 3) 200 frases únicas
  const responses = [
    "1) 💀 TK-HOST mantiene su fortaleza: ni un apocalipsis lo apaga.",
    "2) 🚀 Lanza tu proyecto al espacio con nuestra velocidad sónica.",
    "3) 🤖 A prueba de bots: seguridad y fluidez en cada clic.",
    "4) 🌐 Infraestructura global: tu sitio alcanza todos los continentes.",
    "5) 🛠 Soporte incansable: resolvemos tus dudas en tiempo récord.",
    "6) 📡 Conexión estable: tan firme como un búnker.",
    "7) 🎉 ¡Celebramos tu éxito!: cada cliente que entra es una victoria.",
    "8) 🔌 Encendidos 24/7: la palabra 'offline' no existe aquí.",
    "9) 📊 Monitoreo constante: mantenemos a raya los problemas.",
    "10) 🔥 Fuego total: servidores con energía para tu proyecto.",
    "11) 💰 Cada coin invertido se multiplica en estabilidad y rendimiento.",
    "12) 🖥 Tu panel de control es tu trono de administración.",
    "13) 🎮 Ideal para gamers: latencia mínima, diversión máxima.",
    "14) 📦 Empaca tus ideas y expándelas: aquí hay espacio de sobra.",
    "15) 🔧 Configurable a tu gusto: PHP, Node, Python… ¡lo que necesites!",
    "16) 🏆 Liderando la carrera: tecnología de vanguardia a tu servicio.",
    "17) 🛒 Carrito a mano: contrata hosting en unos pocos clics.",
    "18) 💎 Seguridad como diamante: cortamos cualquier intento de intrusión.",
    "19) 🌟 Servicios premium a precios accesibles: brilla sin gastar de más.",
    "20) 📈 Crece sin límites: estamos listos para escalarte al infinito.",
    "21) 🔌 Pings ultrabajos: di adiós a los retrasos eternos.",
    "22) 💡 Ilumina tu negocio con un hosting siempre encendido.",
    "23) 🔒 Confidencialidad y cifrado: tus datos bajo llave.",
    "24) 🎯 Servidor listo al instante: sin esperas ni complicaciones.",
    "25) 🌌 Explora el universo digital con nuestra sólida plataforma.",
    "26) 🌍 Desde cualquier punto del planeta, tu web vuela ligero.",
    "27) 🤑 Ofertas de temporada: el mejor momento para hacerte con un plan.",
    "28) 👑 Trato real: te mereces lo mejor y nosotros lo sabemos.",
    "29) 📣 Con un hosting potente, tu voz llega más lejos.",
    "30) 📱 Gestión móvil: controla tu servicio desde la palma de la mano.",
    "31) 🌟 Planes a tu medida: paga solo por lo que de verdad usas.",
    "32) 🔥 Rapidísimo: aniquila tiempos de carga y triunfa.",
    "33) 🎭 Sin dramas: una infraestructura estable para que descanses.",
    "34) 🛡 Cortafuegos avanzado: aquí nadie pasa sin invitación.",
    "35) 🎙 Te escuchamos: cada ticket es prioridad para nuestro soporte.",
    "36) 📡 Reportes de estado en tiempo real: cero sorpresas.",
    "37) ⚡ Turbo total: acelera tu web al siguiente nivel.",
    "38) 👾 ¿Servidor de juegos? Perfecto para e-sports y clanes.",
    "39) 🛠 Panel intuitivo: configura sin enredos técnicos.",
    "40) 💀 Hosting inquebrantable: no le teme a nada.",
    "41) 🚀 Despegue inmediato: la plataforma hace el resto.",
    "42) 🤖 Automatiza tareas y deja que el servidor trabaje por ti.",
    "43) 🌐 Encuentra tu público: nosotros garantizamos la cobertura.",
    "44) 🛠 Mantenimiento continuo: queremos que todo fluya.",
    "45) 📡 Semáforo verde constante: vive con uptime real.",
    "46) 🎉 Celebra cada objetivo alcanzado: nosotros te cubrimos.",
    "47) 🔌 Sin desconexiones: nuestras redes son robustas.",
    "48) 📊 Métricas claras: observa el rendimiento de tu proyecto.",
    "49) 🔥 Ardiente velocidad: tu competencia quedará atrás.",
    "50) 💰 Inversión rentable: los beneficios superan el costo.",
    "51) 🖥 Comando total: un panel lleno de herramientas útiles.",
    "52) 🎮 Juegos fluidos: ping bajísimo para que domines la partida.",
    "53) 📦 Respaldos diarios: tus datos siempre a salvo.",
    "54) 🔧 Herramientas para desarrolladores: entornos listos en segundos.",
    "55) 🏆 Apunta alto: hosting de calidad para grandes ambiciones.",
    "56) 🛒 Tiendas online ágiles: no hagas esperar a tus clientes.",
    "57) 💎 Valor premium: cada detalle cuidado al máximo.",
    "58) 🌟 Deslumbra a tus visitantes con una web ágil.",
    "59) 📈 Reputación en alza: un sitio rápido es un sitio exitoso.",
    "60) 🔌 Todo al toque: lanza tu web y olvídate del '¿cómo?'",
    "61) 💡 Levanta tu negocio con nuestra electricidad virtual.",
    "62) 🔒 SSL, cifrados y más: la seguridad no es opcional.",
    "63) 🎯 Te concentras en tu negocio, nosotros en la estabilidad.",
    "64) 🌌 Universo digital sin fronteras: conéctate y expande.",
    "65) 🌍 Ping global: clientes de todo el mundo con la misma fluidez.",
    "66) 🤑 Ahorra con cupones y promos: la calidad no tiene por qué ser cara.",
    "67) 👑 Tratamos a tu proyecto como a la realeza que merece ser.",
    "68) 📣 Difunde tu mensaje: hosting robusto para grandes campañas.",
    "69) 📱 Controla tu servidor mientras viajas: no más ataduras.",
    "70) 🌟 Uptime constelado: brillarás sin apagones.",
    "71) 🔥 Mantén tu web ardiente: sin riesgo de congelaciones súbitas.",
    "72) 🎭 Vida simple: dile adiós a caídas inesperadas.",
    "73) 🛡 Defenderemos tu servidor contra ataques, sin titubeos.",
    "74) 🎙 Soporte humano y cordial: aquí no hay bots irritantes.",
    "75) 📡 Actualizaciones transparentes: sabrás todo antes de que ocurra.",
    "76) ⚡ Carga en milisegundos: tus visitantes no se desesperan.",
    "77) 👾 Perfecto para fans de Minecraft, Valorant y más.",
    "78) 🛠 Compatible con Docker, Git y tus herramientas favoritas.",
    "79) 💀 Inmortal: ni el tiempo lo detiene, siempre encendido.",
    "80) 🚀 Cohete listo: un clic y tu proyecto está en órbita.",
    "81) 🤖 Integrado con APIs, bots, y microservicios: creatividad sin límites.",
    "82) 🌐 Alcance mundial: no importan las fronteras, te encuentran.",
    "83) 🛠 Contrata hoy y lanza tus archivos al instante.",
    "84) 📡 Monitoreo vivo: si surge algo, tomamos acción veloz.",
    "85) 🎉 Cada suscripción es un triunfo mutuo.",
    "86) 🔌 Olvídate de cortes, refuerza tu web con energía 24/7.",
    "87) 📊 Ve cómo crecen tus métricas con un hosting de primera.",
    "88) 🔥 Servidores candentes: que tu competencia no te enfríe.",
    "89) 💰 Máximo retorno de inversión: la estabilidad atrae clientes.",
    "90) 🖥 Todo en uno: base de datos, correos, subdominios.",
    "91) 🎮 Optimizado para streaming, gaming y eventos masivos.",
    "92) 📦 Almacenamiento holgado: sube lo que quieras sin estrés.",
    "93) 🔧 Un clic para instalar WordPress, Laravel, lo que gustes.",
    "94) 🏆 Ganamos en servicio: revisa los comentarios de nuestros clientes.",
    "95) 🛒 Contrata en segundos, gestiona en minutos, crece para siempre.",
    "96) 💎 Brillantez total: tu sitio no pasará desapercibido.",
    "97) 🌟 El éxito está a un hosting de distancia.",
    "98) 📈 Domina Google: la velocidad es clave para SEO.",
    "99) 🔌 Sin interrupciones que afecten tu marca, un servicio impecable.",
    "100) 💡 Gestión fina de recursos: aprovecha cada CPU al máximo.",
    "101) 🔒 HTTPS obligatorio: cuida la confianza de tus usuarios.",
    "102) 🎯 Instala frameworks sin dolores de cabeza.",
    "103) 🌌 Expande tus horizontes: la nube es tu terreno de juego.",
    "104) 🌍 Data centers eco-friendly: ayudamos al planeta también.",
    "105) 🤑 Precios accesibles: tus ideas pueden despegar sin arruinarte.",
    "106) 👑 Ajustado a grandes y pequeños proyectos por igual.",
    "107) 📣 Ten el altavoz listo: un hosting fuerte amplifica tu voz.",
    "108) 📱 Maneja todo desde tu celular: libertad total.",
    "109) 🌟 Destaca en velocidad: tus usuarios sentirán la diferencia.",
    "110) 🔥 Arrasa con la competencia: no los dejes ni respirar.",
    "111) 🎭 Olvídate de sorpresas desagradables: nuestro soporte responde.",
    "112) 🛡 Protección anti-malware y backups diarios incluidos.",
    "113) 🎙 Escuchamos tus feedbacks para mejorar constantemente.",
    "114) 📡 Ancho de banda amplio: deja que miles te visiten sin lentitud.",
    "115) ⚡ Picos de tráfico sin problemas: infraestructura robusta.",
    "116) 👾 Conexión estable para bots de Discord, Telegram y más.",
    "117) 🛠 Herramientas dev-friendly: cPanel, Git, CI/CD y más.",
    "118) 💀 Migramos tu sitio sin que sufras ningún 'apagón'.",
    "119) 🚀 Empuje firme: sube el nuevo contenido y listo.",
    "120) 🤖 Interfaz limpia y clara, apta para novatos y expertos.",
    "121) 🌐 Escudo anti-spam: mantenemos tu reputación impoluta.",
    "122) 🛠 Tus metas, nuestra misión: construyamos el éxito juntos.",
    "123) 📡 Firewall personalizado: cada puerto con su debida protección.",
    "124) 🎉 Cada nueva página lanzada es motivo de celebración.",
    "125) 🔌 Funciona bajo cualquier sistema operativo: flexible y dinámico.",
    "126) 📊 Panel de informes detallado: sabrás todo de tu audiencia.",
    "127) 🔥 Sin saturación: balanceamos cargas para máxima eficacia.",
    "128) 💰 Transparencia de tarifas: nada de 'letras chiquitas'.",
    "129) 🖥 Observa en vivo el rendimiento de tu hosting.",
    "130) 🎮 Sube tu servidor de juegos y reta a tus amigos sin lag.",
    "131) 📦 Copias de seguridad a diario: no arriesgues tu trabajo.",
    "132) 🔧 cPanel, phpMyAdmin, auto-instaladores… Tienes todo al alcance.",
    "133) 🏆 Reconocidos en uptime: no te dejaremos a medio camino.",
    "134) 🛒 Más métodos de pago para tu comodidad.",
    "135) 💎 Rendimiento pulido: verás la diferencia en tus visitas.",
    "136) 🌟 Soporte humano, cálido y en tu idioma.",
    "137) 📈 Escalabilidad programada: crece sin límites.",
    "138) 🔌 Cero pausas: mantenimientos rápidos y planificados.",
    "139) 💡 Aprende en nuestro blog: tutoriales completos y guías.",
    "140) 🔒 Doble factor de autenticación: extra escudo ante intrusos.",
    "141) 🎯 Enfocados en que obtengas resultados, no excusas.",
    "142) 🌌 Toma el control de este universo virtual con valentía.",
    "143) 🌍 Sirve a clientes internacionales: nuestra red está lista.",
    "144) 🤑 Invierte poco y gana mucho: hosting que paga solo.",
    "145) 👑 Dale a tu marca un trono online estable y veloz.",
    "146) 📣 Satura las redes: nuestro hosting no se inmutará.",
    "147) 📱 Panel responsive: gestiona tu hosting desde cualquier pantalla.",
    "148) 🌟 Dales a tus visitantes una experiencia de lujo.",
    "149) 🔥 Ni cenizas dejamos: la competencia se quema solita.",
    "150) 🎭 Sin tragedias: si algo ocurre, lo resolvemos rápido.",
    "151) 🛡 Antivirus integrado: protegiendo tu web en todo momento.",
    "152) 🎙 Opiniones de clientes nos avalan, conviértete en uno más.",
    "153) 📡 Nube escalable: agrega recursos con un par de clics.",
    "154) ⚡ Tus páginas se cargarán antes de que parpadees.",
    "155) 👾 Base de datos inquebrantable, ni con 1.000.000 de queries.",
    "156) 🛠 CI/CD habilitado: integra y despliega sin complicaciones.",
    "157) 💀 Despídete de cualquier temor: tu hosting está blindado.",
    "158) 🚀 Rumbo al éxito: sin mirar atrás ni para arrancar.",
    "159) 🤖 Compatibilidad total con IA, VR, AR y nuevos lenguajes.",
    "160) 🌐 Orquestación perfecta: tu ecosistema digital bien afinado.",
    "161) 🛠 Ideal para e-commerce: no pierdas ventas por lentitud.",
    "162) 📡 Mantente en la nube: desconexión es cosa del pasado.",
    "163) 🎉 Cada día sin caídas es un hito a festejar.",
    "164) 🔌 Respaldos en caliente: ni un bit extraviado.",
    "165) 📊 Observa tu crecimiento: con un buen hosting todo suma.",
    "166) 🔥 Ríete de la competencia con nuestro rendimiento robusto.",
    "167) 💰 Equilibrio perfecto entre costo y calidad.",
    "168) 🖥 Personaliza cada detalle: de la base de datos a la interfaz.",
    "169) 🎮 Soporte gamer: latencia mínima para noches épicas.",
    "170) 📦 Aumenta tu capacidad en segundos si lo necesitas.",
    "171) 🔧 Reparamos inconvenientes como relámpago.",
    "172) 🏆 Viste tu web con la mejor infraestructura.",
    "173) 🛒 Variedad de pasarelas de pago: hazlo fácil a tus clientes.",
    "174) 💎 Hosting VIP: brilla con elegancia y solidez.",
    "175) 🌟 Destácate con un uptime descomunal.",
    "176) 📈 Tu web veloz: más leads, más conversiones.",
    "177) 🔌 Todo conectado: no sufras microcortes en horas pico.",
    "178) 💡 En constante innovación: servidores de última generación.",
    "179) 🔒 Certificados SSL y subdominios a un clic.",
    "180) 🎯 Apuntamos a tu satisfacción total. ¡Lo logramos!",
    "181) 🌌 Explora nuevas funciones, la configuración está en tus manos.",
    "182) 🌍 Nodos de alta velocidad: cada milisegundo cuenta.",
    "183) 🤑 Gana más: un sitio que vuela retiene clientes.",
    "184) 👑 Sé el rey de tu nicho: con un hosting que deslumbra.",
    "185) 📣 Difunde campañas de email marketing sin bloqueos.",
    "186) 📱 Administra tu hosting de camino al trabajo o en la playa.",
    "187) 🌟 Avanza sin frenos: todo un equipo te respalda.",
    "188) 🔥 Nivela a tu competencia con una web superior.",
    "189) 🎭 No hay tragedias: si algo falla, lo arreglamos a tiempo.",
    "190) 🛡 Te blindamos contra ataques directos: anti-DDoS activo.",
    "191) 🎙 Soporte cercano: sentimos tu proyecto como nuestro.",
    "192) 📡 Notificaciones de mantenimiento: siempre te informamos antes.",
    "193) ⚡ Hardware de élite: potencia sin cuellos de botella.",
    "194) 👾 Apto para foros, bots, blogs y servidores de comunidad.",
    "195) 🛠 Subida masiva de archivos: trabaja con grandes volúmenes.",
    "196) 💀 Nada lo derriba: hosting a prueba de catástrofes.",
    "197) 🚀 El impulso final para tu éxito digital.",
    "198) 🤖 Scripts automáticos: orquesta tu backend sin sudar.",
    "199) 🌐 Firmeza total: usuarios felices que siempre regresan.",
    "200) 🛠 Ajusta cada parámetro: la personalización es infinita."
  ]
  // Selección de frase al azar
  const randomResponse = responses[Math.floor(Math.random() * responses.length)]

  // 4) Formato final
  const text = `
✦━── ──━✦ E-S-T-A-D-O ✦━── ──━✦

🔍 Estado del Servicio 📡
${randomResponse}

> Consulta aquí:
> https://dash.tk-joanhost.com/home

> Canal Random:
> ${randomCanal}
`.trim()

  // 5) Enviar el mensaje con la imagen y el texto
  await conn.sendFile(m.chat, randomImageUrl, 'estado.jpg', text, m, rcanal)
}

// Comandos para este handler
handler.command = ['estado', 's']
handler.tags = ['estado']
handler.help = ['estado', 's']

export default handler

