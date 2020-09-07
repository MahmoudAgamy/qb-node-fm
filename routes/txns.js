const express = require('express');
const router = express.Router();
const Txn = require('../models/Txn')


router.get('/', async (req, res) => {
 const txns = await Txn.findAll();
 res.send(txns)
})
router.get('/crt', async (req, res) => {
 const txns = await Txn.create({value: 50});
 res.send(txns)
})

module.exports = router;