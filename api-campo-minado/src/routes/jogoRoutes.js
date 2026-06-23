const express = require('express');
const router = express.Router();
const jogoController = require('../controllers/jogoController');

router.post('/start', jogoController.iniciarJogo);
router.post('/:gameId/reveal', jogoController.revelarPosicao);
router.post('/:gameId/cashout', jogoController.cashout);

module.exports = router;
