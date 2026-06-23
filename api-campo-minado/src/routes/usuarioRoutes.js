const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// IMPORTANTE: a rota /dashboard deve vir ANTES de /:id
// para evitar que 'dashboard' seja interpretado como um ID
router.get('/dashboard/:id', usuarioController.dashboard);
router.get('/:id', usuarioController.buscarPorId);
router.put('/:id', usuarioController.atualizarSaldo);
router.delete('/:id', usuarioController.excluir);

module.exports = router;
