const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.get('/dashboard', usuarioController.dashboard);
router.get('/:id', usuarioController.buscarPorId);
router.put('/:id', usuarioController.atualizarSaldo);
router.delete('/:id', usuarioController.excluir);

module.exports = router;