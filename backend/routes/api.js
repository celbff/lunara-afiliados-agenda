// backend/routes/api.js
const express = require('express');
const router = express.Router();
const { adicionarAgendamento } = require('../controllers/agendamento');

// Rota para receber agendamentos
router.post('/agendamentos', adicionarAgendamento);

module.exports = router;
