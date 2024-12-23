let handler = m => m;

handler.before = async function (m, { conn, isAdmin, isBotAdmin }) {
  if (!m.isGroup) return !1; // Asegurarse de que solo se ejecuta en grupos

  // Lista negra de prefijos no permitidos
  const blacklistedPrefixes = [
    "20", "211", "212", "213", "214", "216", "218", "220", "221", "222",
    "223", "224", "225", "226", "227", "228", "229", "230", "231", "232",
    "233", "234", "235", "236", "237", "238", "239", "240", "241", "242",
    "243", "244", "245", "246", "247", "248", "249", "250", "251", "252",
    "253", "254", "255", "256", "257", "258", "260", "261", "262", "263",
    "264", "265", "266", "267", "268", "269", "27", "290", "291", "298",
    "30", "31", "32", "33", "350", "351", "352", "353", "354", "355",
    "356", "357", "358", "359", "36", "370", "371", "372", "373", "374",
    "375", "376", "377", "378", "379", "380", "381", "382", "383", "385",
    "386", "387", "389", "40", "41", "420", "421", "423", "43", "44",
    "45", "46", "47", "48", "49", "7", "81", "82", "84", "850", "852",
    "853", "855", "856", "86", "880", "886", "90", "91", "92", "93", "94",
    "95", "960", "961", "962", "963", "964", "965", "966", "967", "968",
    "970", "971", "972", "973", "974", "975", "976", "977", "98", "992",
    "993", "994", "995", "996", "998", "60", "61", "62", "63", "64", "65",
    "66", "670", "672", "673", "674", "675", "676", "677", "678", "679",
    "680", "681", "682", "683", "685", "686", "687", "688", "689", "690",
    "691", "692", "800", "808", "870", "875", "876", "877", "878", "879",
    "881", "882", "883", "979", "991",
  ];

  let chat = global.db.data.chats[m.chat];
  if (!chat || !chat.autoAceptar) return !1; // Asegurarse de que autoAceptar está habilitado

  if (!isAdmin && isBotAdmin) {
    // Obtener lista de solicitudes pendientes
    const participants = await conn.groupRequestParticipantsList(m.chat).catch(err => {
      console.error("Error obteniendo solicitudes pendientes:", err);
      return [];
    });

    // Verificación de solicitudes pendientes
    if (!participants || participants.length === 0) return !1;

    // Filtrar participantes permitidos
    const allowedParticipants = participants.filter(p => {
      if (!p.jid || !p.jid.includes('@s.whatsapp.net')) return false; // Validar formato del JID
      const number = p.jid.split('@')[0]; // Extraer número
      const prefix = number.slice(0, number.length - 8); // Extraer prefijo
      return !blacklistedPrefixes.includes(prefix); // Aceptar si no está en la lista negra
    });

    // Aprobar solicitudes filtradas
    for (const participant of allowedParticipants) {
      await conn.groupRequestParticipantsUpdate(m.chat, [participant.jid], "approve").catch(err => {
        console.error(`Error aprobando solicitud de ${participant.jid}:`, err);
      });
    }
  }

  // Manejo de eventos específicos
  if (m.messageStubType === 172 && m.messageStubParameters) {
    const [jid] = m.messageStubParameters;
    if (!jid || !jid.includes('@s.whatsapp.net')) return !1; // Validar formato del JID
    const number = jid.split('@')[0]; // Extraer número
    const prefix = number.slice(0, number.length - 8); // Extraer prefijo
    if (!blacklistedPrefixes.includes(prefix)) {
      await conn.groupRequestParticipantsUpdate(m.chat, [jid], "approve").catch(err => {
        console.error(`Error aprobando solicitud de ${jid}:`, err);
      });
    }
  }
};

export default handler;
