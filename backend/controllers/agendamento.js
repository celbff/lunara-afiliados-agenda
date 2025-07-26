// backend/controllers/agendamento.js
const { createClient } = require('@supabase/supabase-js');

// Inicialize o cliente Supabase com suas credenciais
const supabaseUrl = 'https://wqzjxykmqnzcgdlbmuqj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indxemp4eWttcW56Y2dkbGJtdXFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0OTQxOTYsImV4cCI6MjA2OTA3MDE5Nn0.w61cXkhP89aUfrdhmE8QYkU9HOuDe6pG0i0Qq8Ok89c';
const supabase = createClient(supabaseUrl, supabaseKey);

// Função para adicionar agendamento
exports.adicionarAgendamento = async (req, res) => {
  try {
    const { terapeutaId, terapeutaNome, terapia, valor, data } = req.body;

    // Salva no Supabase
    const { data: agendamento, error } = await supabase
      .from('agendamentos')
      .insert([
        {
          terapeuta_id: terapeutaId,
          terapeuta_nome: terapeutaNome,
          terapia,
          valor,
          data
        }
      ])
      .select();

    if (error) throw error;

    res.status(201).json({ message: 'Agendamento salvo com sucesso!', agendamento });
  } catch (error) {
    console.error('Erro ao salvar agendamento:', error);
    res.status(500).json({ error: 'Falha ao salvar agendamento' });
  }
};
