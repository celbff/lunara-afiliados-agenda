// backend/controllers/agendamento.js
const admin = require('firebase-admin');

// Inicialize o Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: 'SEU_PROJECT_ID',
      clientEmail: 'SEU_CLIENT_EMAIL',
      privateKey: 'SUA_PRIVATE_KEY'.replace(/\\n/g, '\n')
    }),
    databaseURL: 'https://SEU_PROJECT_ID.firebaseio.com'
  });
}

const db = admin.firestore();

// Função para adicionar agendamento
exports.adicionarAgendamento = async (req, res) => {
  try {
    const { terapeutaId, terapeutaNome, terapia, valor, data } = req.body;

    // Salva no Firestore
    await db.collection('agendamentos').add({
      terapeutaId,
      terapeutaNome,
      terapia,
      valor,
      data,
      createdAt: new Date()
    });

    res.status(201).json({ message: 'Agendamento salvo com sucesso!' });
  } catch (error) {
    console.error('Erro ao salvar agendamento:', error);
    res.status(500).json({ error: 'Falha ao salvar agendamento' });
  }
};
