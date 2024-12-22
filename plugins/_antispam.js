const userSpamData = {};
let handler = m => m;

handler.before = async function (m, { conn, isAdmin, isBotAdmin, isOwner, isROwner, isPrems }) {
  const chat = global.db.data.chats[m.chat];
  const bot = global.db.data.settings[conn.user.jid] || {};

  if (!bot.antiSpam) return;
  if (m.isGroup && chat.modoadmin) return;

  const sender = m.sender;
  const currentTime = Date.now();
  const timeWindow = 5000; // Tiempo límite (5 segundos)
  const messageLimit = 10; // Límite de mensajes en el tiempo establecido

  // Ignorar si el remitente es administrador, owner o el mismo bot
  if (isOwner || isROwner || isAdmin || !isBotAdmin || isPrems || m.sender === conn.user.jid) return;

  const timeouts = [30000, 60000, 120000]; // 30s, 1min, 2min
  const warnings = [
    { message: "᥀·࣭࣪̇˖⚔️◗ No hagas spam.", level: 1 },
    { message: "᥀·࣭࣪̇˖⚔️◗ No hagas spam...", level: 2 },
    { message: "᥀·࣭࣪̇˖👺◗ Serás eliminado(a) por hacer spam.", level: 3 }
  ];

  if (!(sender in userSpamData)) {
    userSpamData[sender] = {
      lastMessageTime: currentTime,
      messageCount: 1,
      antiBanLevel: 0,
      warningTimers: { first: false, second: false, third: false }
    };
  } else {
    const userData = userSpamData[sender];
    const timeDifference = currentTime - userData.lastMessageTime;

    if (timeDifference <= timeWindow) {
      userData.messageCount += 1;

      if (userData.messageCount >= messageLimit) {
        userData.antiBanLevel += 1;
        userData.messageCount = 0;
        const level = userData.antiBanLevel;

        if (level < 3) {
          const warning = warnings[level - 1];
          if (!userData.warningTimers[`level${warning.level}`]) {
            userData.warningTimers[`level${warning.level}`] = true;
            await conn.reply(sender, warning.message, null, { mentions: [sender] }); // Enviar advertencia al privado

            setTimeout(() => {
              if (userSpamData[sender]?.antiBanLevel === level) {
                userSpamData[sender].antiBanLevel = 0;
                userData.warningTimers[`level${warning.level}`] = false;
              }
            }, timeouts[level - 1]);
          }
        } else {
          await conn.reply(sender, warnings[2].message, null, { mentions: [sender] }); // Notificación al privado
          await conn.groupParticipantsUpdate(m.chat, [sender], 'remove');
          delete userSpamData[sender];
        }
      }
    } else {
      if (timeDifference >= 2000) {
        userData.messageCount = 1;
      }
    }

    userData.lastMessageTime = currentTime;
  }
};

export default handler;
